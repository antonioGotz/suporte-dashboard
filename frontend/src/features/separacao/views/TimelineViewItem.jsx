import React, { useState, useEffect, useRef } from 'react';
import { Card, Header, Title, Meta, Stages, ProgressBar, Badge, Actions, Small } from './TimelineViewSC.styles';
import StatusBadge from '../components/StatusBadge';
import { percentFor, tooltipFor, stageIndex, percentTipFor } from './TimelineViewSC.utils';
import { STATUS_PIPELINE } from '../../../domain/statusPipeline';

export default function TimelineViewItem({ item, statusPipeline, stageByCode, classifySLA, onUpdateStatus, onGenerateLabel, updatingIds, labelLocked }){
  // use canonical pipeline (same source as Kanban) to guarantee identical labels/order
  const canonicalStages = (Array.isArray(STATUS_PIPELINE) && STATUS_PIPELINE.length > 0)
    ? STATUS_PIPELINE.filter(s => !('isFallback' in s))
    : (Array.isArray(statusPipeline) ? statusPipeline.filter(s=>!('isFallback' in s)) : []);

  const stageCode = item.status_code || item.status;
  // try direct map first (fast), then fallback to search canonicalStages by statusCode or key
  let stage = stageCode ? stageByCode[stageCode] : undefined;
  if (!stage && stageCode) {
    // fallback: try find by statusCode or by key/label in canonicalStages
    stage = canonicalStages.find(s => ((s.statusCode || s.key) === stageCode) || s.key === stageCode || s.statusLabel === stageCode || s.label === stageCode);
    if (!stage) {
      // helpful debug when an unexpected status value is used in data
      // eslint-disable-next-line no-console
      console.debug('[Timeline] stage not found for code:', stageCode, ' — available keys:', canonicalStages.map(s=>s.statusCode||s.key));
    }
  }

  const pct = percentFor(stageCode, canonicalStages);
  const sla = classifySLA(item.next_shipment_date ? new Date(item.next_shipment_date).toISOString().split('T')[0] : null);
  const slaText = (() => {
    const ymd = item.next_shipment_date ? new Date(item.next_shipment_date).toISOString().split('T')[0] : null;
    if (!ymd) return '';
    const today = new Date();
    today.setHours(0,0,0,0);
    try {
      const d = new Date(String(ymd) + 'T00:00:00');
      const diff = Math.ceil((d - today) / (24 * 60 * 60 * 1000));
      if (Number.isNaN(diff)) return '';
      if (diff < 0) return 'Prazo encerrado';
      if (diff === 0) return 'Envia hoje';
      if (diff === 1) return 'Resta 1 dia';
      return `Restam ${diff} dias`;
    } catch {
      return '';
    }
  })();
  const canNext = Boolean(stage && stage.nextCode);
  const canPrev = Boolean(stage && stage.prevCode);
  const visibleStages = canonicalStages;
  const [animPct, setAnimPct] = useState(pct);
  const tipPct = percentTipFor(stageCode, canonicalStages);
  // refs for debugging alignment: stages container and inner fill element
  const stagesRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(()=>{
    // sync animPct with real pct when props change (after fetch)
    setAnimPct(pct);
  },[pct]);

  // Debug: measure bounding boxes of labels vs progress fill and log to console
  useEffect(() => {
    try {
      const stagesEl = stagesRef.current;
      const fillEl = fillRef.current;
      if (!stagesEl || !fillEl) return;

      const stageNodes = Array.from(stagesEl.children || []);
      const stageRects = stageNodes.map((n, i) => {
        const r = n.getBoundingClientRect();
        return {
          index: i,
          key: n.getAttribute('data-stage-key') || n.textContent || String(i),
          left: Math.round(r.left),
          width: Math.round(r.width),
          centerX: Math.round(r.left + r.width / 2),
        };
      });

      const fillRect = fillEl.getBoundingClientRect();
      const fillParent = fillEl.parentElement && fillEl.parentElement.getBoundingClientRect();
      const fillInfo = {
        left: Math.round(fillRect.left),
        width: Math.round(fillRect.width),
        right: Math.round(fillRect.right),
        parentLeft: fillParent ? Math.round(fillParent.left) : null,
        parentWidth: fillParent ? Math.round(fillParent.width) : null,
        pctWidth: Math.round((fillRect.width / (fillParent?.width || fillRect.width)) * 100),
      };

      console.group('Timeline alignment debug - order & positions');
      console.log('stageRects', stageRects);
      console.log('fillInfo', fillInfo);
      console.groupEnd();
    } catch (e) {
      console.error('Timeline alignment debug failed', e);
    }
  }, [animPct, canonicalStages]);

  return (
    <Card>
      <Header>
        <div>
          <Title>{`#${item.order_id} — ${item.mother_name || item.customer || '—'}`}</Title>
          <Meta>{item.product_to_send?.name || item.product_name || item.product?.name || ''} · {item.city || ''}</Meta>
        </div>
        <div style={{display:'flex',gap:8,flexDirection:'column',alignItems:'flex-end'}}>
          <StatusBadge
            statusCode={stage?.statusCode || stage?.key || item.status_code || item.status}
            label={stage ? stage.statusLabel : (item.status || 'Não definido')}
          />
          <div style={{display:'flex', alignItems:'center', gap:6, marginTop:4}}>
            <span style={{width:8, height:8, borderRadius:9999, background: (sla.intent==='danger' ? '#ef4444' : sla.intent==='warn' ? '#f59e0b' : '#0ea5e9')}} />
            <span style={{fontSize:11, color: (sla.intent==='danger' ? '#ef4444' : sla.intent==='warn' ? '#f59e0b' : '#0ea5e9')}}>{slaText || sla.label}</span>
          </div>
        </div>
      </Header>

        <Stages ref={stagesRef}>
          {visibleStages.map((s, i)=> <div key={s.key} data-stage-key={s.key} style={{flex:1,textAlign:'center'}}>{s.label}</div>)}
        </Stages>

      <ProgressBar aria-label={tooltipFor(stageCode, statusPipeline)}>
        <div ref={fillRef} style={{width:`${animPct}%`, transition: 'width 520ms cubic-bezier(.2,.9,.2,1)'}} />
      </ProgressBar>

      <Actions>
        <div style={{flex:1}}>
          <Small>{tooltipFor(stageCode, statusPipeline)}</Small>
        </div>
        <div>
          <button
            title={canPrev ? 'Voltar para a etapa anterior' : 'Não há etapa anterior'}
            disabled={Boolean(!canPrev || updatingIds?.[item.order_id])}
            onClick={async ()=>{
              if(!canPrev || updatingIds?.[item.order_id]) return;
              const currentIdx = visibleStages.findIndex(v=> (v.statusCode||v.key) === (stageCode || (stage && stage.key)));
              const prevIdx = Math.max(0, currentIdx - 1);
              const prevPct = Math.round(((prevIdx + 0.5) / visibleStages.length) * 100);
              setAnimPct(prevPct);
              try{
                await onUpdateStatus(item.order_id, stageCode, 'prev');
              }catch(e){
                setAnimPct(pct);
              }
            }}
          >← Voltar</button>

          <button
            title={canNext ? 'Avançar para a próxima etapa' : 'Não há próxima etapa'}
            disabled={Boolean(!canNext || updatingIds?.[item.order_id])}
            onClick={async ()=>{
              if(!canNext || updatingIds?.[item.order_id]) return;
              const currentIdx = visibleStages.findIndex(v=> (v.statusCode||v.key) === (stageCode || (stage && stage.key)));
              const nextIdx = Math.min(visibleStages.length-1, currentIdx + 1);
              const nextPct = Math.round(((nextIdx + 0.5) / visibleStages.length) * 100);
              setAnimPct(nextPct);
              try{
                await onUpdateStatus(item.order_id, stageCode, 'next');
              }catch(e) {
                setAnimPct(pct);
              }
            }}
          >Próximo →</button>
          {stage && stage.key === 'shipped' && (
            <button disabled={Boolean(labelLocked?.[item.order_id] || updatingIds?.[item.order_id])} onClick={()=> onGenerateLabel(item.order_id)} style={{marginLeft:8}}>Gerar Etiqueta</button>
          )}
        </div>
      </Actions>
    </Card>
  );
}
