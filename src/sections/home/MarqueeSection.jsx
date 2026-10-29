function MarqueeSection() {
  const items = [
    "STUDENTS",
    "FACULTY",
    "ADMINISTRATION",
    "ACADEMICS",
    "CAMPUS LIFE",
    "PLACEMENTS",
    "ANALYTICS",
    "EXAMINATIONS",
  ];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-content">
        {items.concat(items).map((item, index) => (
          <span key={index} className={index % 2 === 0 ? "highlight" : ""}>
            {item} <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

export default MarqueeSection;
