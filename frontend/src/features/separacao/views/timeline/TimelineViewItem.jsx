import React, { useState, useEffect, useRef } from 'react';
import { Card, Header, Title, Meta, Stages, ProgressBar, Badge, Actions, Small } from './TimelineViewSC.styles';
import StatusBadge from '../../components/StatusBadge';
import { percentFor, tooltipFor, stageIndex, percentTipFor } from './TimelineViewSC.utils';
import { STATUS_PIPELINE } from '../../../../domain/statusPipeline';

export default function TimelineViewItem({ item, statusPipeline, stageByCode, classifySLA, onUpdateStatus, onGenerateLabel, updatingIds, labelLocked }){
  // canonical pipeline (same as Kanban)
  const canonicalStages = (Array.isArray(STATUS_PIPELINE) && STATUS_PIPELINE.length > 0)
    ? STATUS_PIPELINE.filter(s => !('isFallback' in s))
    : (Array.isArray(statusPipeline) ? statusPipeline.filter(s=>!('isFallback' in s)) : []);

  // Helper para garantir data válida (YYYY-MM-DD) ou null
  const getSafeYMD = (dateVal) => {
    if (!dateVal) return null;
    try {
      const d = new Date(dateVal);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString().split('T')[0];
    } catch (e) {
      return null;
    }
  };

  const stageCode = item.status_code || item.status;
  // lookup with fallback
  let stage = stageCode ? stageByCode[stageCode] : undefined;
  if(!stage && stageCode){
    stage = canonicalStages.find(s => ((s.statusCode || s.key) === stageCode) || s.key === stageCode || s.statusLabel === stageCode || s.label === stageCode);
    if(!stage){
      // eslint-disable-next-line no-console
      console.debug('[Timeline][timeline] stage not found for code:', stageCode, 'available:', canonicalStages.map(s=>s.statusCode||s.key));
    }
  }
  const pct = percentFor(stageCode, canonicalStages);

  // Usa helper seguro para evitar crash com datas inválidas
  const safeYMD = getSafeYMD(item.next_shipment_date);
  const sla = classifySLA(safeYMD);

  const slaText = (() => {
    if (!safeYMD) return '';
    const today = new Date();
    today.setHours(0,0,0,0);
    try {
      const d = new Date(safeYMD + 'T00:00:00');
      if (Number.isNaN(d.getTime())) return '';

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
  const stagesRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(()=>{
    // sync animPct with real pct when props change (after fetch)
    setAnimPct(pct);
  },[pct]);

  return (
    <Card>
      <Header>
        <div>
          <Title>{`#${item.order_id} — ${item.mother_name || item.customer || '—'}`}</Title>
          <Meta>{item.product_to_send?.name || item.product_name || item.product?.name || ''} · {item.city || ''}</Meta>
        </div>
        <div style={{display:'flex',gap:8,flexDirection:'column',alignItems:'flex-end'}}>
          <StatusBadge statusCode={stage?.statusCode || stage?.key || item.status_code || item.status} label={stage ? stage.statusLabel : (item.status || 'Não definido')} />
          <div style={{display:'flex', alignItems:'center', gap:6, marginTop:4}}>
            <span style={{width:8, height:8, borderRadius:9999, background: (sla.intent==='danger' ? '#ef4444' : sla.intent==='warn' ? '#f59e0b' : '#0ea5e9')}} />
            <span style={{fontSize:11, color: (sla.intent==='danger' ? '#ef4444' : sla.intent==='warn' ? '#f59e0b' : '#0ea5e9')}}>{slaText || sla.label}</span>
          </div>
        </div>
      </Header>

      <Stages ref={stagesRef}>
        {visibleStages.map((s, i)=>{
          const sKey = s.statusCode || s.key;
          const isCurrent = Boolean(stageCode && (sKey === stageCode || sKey === (stage && stage.key)));
          return (
            <div key={s.key} data-stage-key={s.key} style={{flex:1,textAlign:'center', color: isCurrent ? 'var(--color-text, #e5e7eb)' : undefined, fontWeight: isCurrent ? 700 : 500, opacity: isCurrent ? 1 : 0.85}}>{s.label}</div>
          );
        })}
      </Stages>

      <ProgressBar aria-label={tooltipFor(stageCode, statusPipeline)}>
        <div ref={fillRef} className="fill" data-pulse={Boolean(stageCode)} style={{width:`${animPct}%`}} />
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
            <button disabled={Boolean(labelLocked?.[item.order_id] || updatingIds?.[item.order_id])} onClick={()=> onGenerateLabel(item.order_id)} style={{marginLeft:8}}>
              {updatingIds?.[item.order_id] ? (
                <>
                  <span style={{width:12, height:12, display:'inline-block', marginRight:8, border:'2px solid rgba(148,163,184,.4)', borderTopColor:'rgba(148,163,184,1)', borderRadius:9999, animation:'spin 0.8s linear infinite'}} />
                  Gerando...
                </>
              ) : (
                'Gerar Etiqueta'
              )}
            </button>
          )}
        </div>
      </Actions>
    </Card>
  );
}
