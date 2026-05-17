import { RotateCcw } from "lucide-react";

function Slider({
  label,
  defaultValue = "0",
  formatValue,
  rangeValue,
  setRangeValue,
  min = 0,
  max = 100,
}: {
  label: string;
  defaultValue?: string;
  formatValue: (value: number) => string;
  rangeValue: string;
  setRangeValue: (value: string) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex justify-center items-center gap-3 transition-opacity duration-150">
      <label htmlFor="range" className="text-xl text-start text-nowrap w-30">
        {label}
      </label>
      <input
        type="range"
        id="range"
        value={rangeValue}
        onChange={(e) => setRangeValue(e.target.value)}
        min={min}
        max={max}
      />
      <span className="text-nowrap text-start w-12">
        {formatValue(parseInt(rangeValue))}
      </span>
      <RotateCcw
        className="stroke-primary duration-150 hover:-rotate-30 hover:cursor-pointer active:duration-75 active:-rotate-60 transition-transform size-5.5"
        onClick={() => setRangeValue(defaultValue)}
      />
    </div>
  );
}

export default Slider;
