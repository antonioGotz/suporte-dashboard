import React, { useMemo } from 'react';
import TimelineViewItem from './TimelineViewItem';
import { TimelineWrapper } from './TimelineViewSC.styles';

export function TimelineViewSC({ orders = [], statusPipeline = [], stageByCode = {}, classifySLA = ()=>({intent:'info', label:'-' }), onUpdateStatus, onGenerateLabel, updatingIds = {}, labelLocked = {} }){
  const items = useMemo(()=> Array.isArray(orders) ? orders : [], [orders]);

  return (
    <TimelineWrapper>
      {items.map(it => (
        <TimelineViewItem key={it.order_id || `${it.subscriber_id}_${it.child_id||it.baby_name||''}`} item={it} statusPipeline={statusPipeline} stageByCode={stageByCode} classifySLA={classifySLA} onUpdateStatus={onUpdateStatus} onGenerateLabel={onGenerateLabel} updatingIds={updatingIds} labelLocked={labelLocked} />
      ))}
      {items.length===0 && <div style={{color:'#94a3b8'}}>Nenhum pedido encontrado para esta visualização.</div>}
    </TimelineWrapper>
  );
}

export default TimelineViewSC;
