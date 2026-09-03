import { SopranoMark } from "./SopranoMark";

///
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <SopranoMark />

        <div className="text-slate-500">
          Carregando...
        </div>
      </div>
    </div>
  );
}

export {
  LoadingScreen,
};
