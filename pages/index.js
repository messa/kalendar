import Head from 'next/head'

const buildMonthTableData = (year, month) => {
  const month0 = month - 1;
  const calendarTableRows = [];
  const firstDay = new Date(year, month0, 1);
  let currentRow = [];
  calendarTableRows.push(currentRow);
  const getDayOfWeek = (dt) => {
    const dow = dt.getDay();
    return (dow == 0) ? 7 : dow;
  };
  const firstDayDow = getDayOfWeek(firstDay);
  for (let pos = 1; pos < firstDayDow; pos += 1) {
    currentRow.push(null);
  }
  let day = firstDay;
  while (true) {
    const dow = getDayOfWeek(day);
    currentRow.push({
      dayOfWeek: dow,
      dayOfMonth: day.getDate()
    })
    day = new Date(day.getTime() + 1000 * 24 * 3600);
    if (day.getMonth() != month0) {
      break;
    }
    if (day.getDay() == 1) {
      currentRow = [];
      calendarTableRows.push(currentRow);
    }
  }
  return calendarTableRows;
}

const EmptyDay = () => (
  <div>-</div>
);

const Day = (props) => (
  <div>
    <div style={{
        fontFamily: "inconsolata, monospace",
        fontSize: "175%",
        color: props.isCurrent ? "red" : null,
      }}>
      {props.dayOfMonth}
    </div>
  </div>
);

const getMonthName = (month) => {
  switch (month) {
    case 1: return "Leden";
    case 2: return "Únor";
    case 3: return "Březen";
    case 4: return "Duben";
    case 5: return "Květen";
    case 6: return "Červen";
    case 7: return "Červenec";
    case 8: return "Srpen";
    case 9: return "Září";
    case 10: return "Říjen";
    case 11: return "Listopad";
    case 12: return "Prosinec";
  }
  throw new Error("Invalid month value: " + month);
};

const Month = (props) => {
  const year = props.year || props.date.getFullYear();
  const month = props.month || (props.date.getMonth() + 1);
  let currentDayOfMonth = null;
  if (props.currentDate) {
    if (props.currentDate.getFullYear() == year && props.currentDate.getMonth()+1 == month) {
      currentDayOfMonth = props.currentDate.getDate();
    }
  }
  if (month < 1 || month > 12) {
    throw new Error("Invalid month value");
  }
  const calendarTableRows = buildMonthTableData(year, month);
  return (
    <div>
      <h3>
        {getMonthName(month)} {" "}
        {year}
      </h3>
      <table className="calendar-month">
        <thead>
          <tr>
            <th>Po</th>
            <th>út</th>
            <th>St</th>
            <th>čt</th>
            <th>Pá</th>
            <th>So</th>
            <th>Ne</th>
          </tr>
        </thead>
        <tbody>
          {calendarTableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((day, dayIndex) => (
                <td className="calendar-day" key={dayIndex}>
                  {day === null
                    ? <EmptyDay/>
                    : <Day
                        dayOfMonth={day.dayOfMonth}
                        isCurrent={day.dayOfMonth === currentDayOfMonth}
                        />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        table.calendar-month td,
        table.calendar-month th {
          padding: 0.1rem 0.66em;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

const getPrevMonth = (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1);
const getNextMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 1);

export default () => {
  const now = new Date();
  const prevMonth = getPrevMonth(now);
  const nextMonth = getNextMonth(now);
  return (
    <div className="container">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css"/>
      </Head>
      <h1>Kalendář</h1>

      <div className="row">
        <div className="col-md-4">
          <Month date={prevMonth}/>
        </div>
        <div className="col-md-4">
          <Month date={now} currentDate={now}/>
        </div>
        <div className="col-md-4">
          <Month date={nextMonth}/>
        </div>
      </div>
    </div>
  );
}
