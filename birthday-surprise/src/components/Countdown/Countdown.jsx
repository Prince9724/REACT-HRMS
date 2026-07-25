import useCountdown from "../../hooks/useCountdown.js";
import config from "../../data/config.js";

function TimeBlock({ value, label }) {
  return (
    <div className="bg-white rounded-2xl card-shadow px-5 py-4 min-w-[80px] text-center">
      <p className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-xs uppercase tracking-wide text-gray-500 mt-1">
        {label}
      </p>
    </div>
  );
}

export default function Countdown() {
  const { total, days, hours, minutes, seconds } = useCountdown(
    config.birthdayDate
  );
  const hasArrived = total <= 0;

  return (
    <section className="section-wrapper text-center">
      <h2 className="font-heading text-4xl text-primary mb-2">
        {hasArrived
          ? config.countdown.headingAfter
          : config.countdown.headingBefore}
      </h2>
      <p className="text-gray-600 mb-10">{config.countdown.subheading}</p>

      {!hasArrived ? (
        <div className="flex flex-wrap justify-center gap-4">
          <TimeBlock value={days} label="Days" />
          <TimeBlock value={hours} label="Hours" />
          <TimeBlock value={minutes} label="Minutes" />
          <TimeBlock value={seconds} label="Seconds" />
        </div>
      ) : (
        <div className="text-7xl animate-bounce">🎉</div>
      )}
    </section>
  );
}
