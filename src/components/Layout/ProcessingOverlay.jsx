function ProcessingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        Processando...
      </div>
    </div>
  );
}

export {
  ProcessingOverlay,
};
