export function useLista2Actions({ onSetStatus, onGenerateLabel, updatingIds = {} } = {}) {
  const isUpdating = (id) => Boolean(updatingIds?.[id]);

  const handleAdvance = async (orderId, nextStatusCode) => {
    if (!orderId || !onSetStatus) return;
    try {
      await onSetStatus(orderId, nextStatusCode);
    } catch (err) {
      console.error('useLista2Actions.handleAdvance error', err);
    }
  };

  const handleGenerate = async (orderId) => {
    if (!orderId || !onGenerateLabel) return;
    try {
      await onGenerateLabel(orderId);
    } catch (err) {
      console.error('useLista2Actions.handleGenerate error', err);
    }
  };

  return { isUpdating, handleAdvance, handleGenerate };
}
