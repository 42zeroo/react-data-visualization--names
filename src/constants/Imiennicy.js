import raw from "./imiennicy.txt";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

console.log(raw);

const Imiennicy = () => {
  const [state, setState] = useState("");
  const [result, setResult] = useState([]);
  const [peoplePercent, setPeoplePercent] = useState(0);
  const [peopleCounter, setPeopleCounter] = useState(0);
  const [chart, setChart] = useState(null);
  useEffect(() => {
    fetch(raw)
      .then((r) => r.text())
      .then((text) => {
        var lines = text.split("\n");
        var header = [];
        header.push(lines[0].split("	")[0].toString());
        header.push(lines[0].split("	")[1]);
        header.push(lines[0].split("	")[2].toString());
        console.log(header[2].split(`\\`)[0]);
        var result = [];
        for (var line = 1; line < lines.length; line++) {
          var newRowData = [];
          newRowData.push(
            JSON.parse(
              '{"' + header[0] + '": "' + lines[line].split("	")[0] + '"}'
            )
          );
          newRowData.push(
            JSON.parse(
              '{"' + header[1] + '": "' + lines[line].split("	")[1] + '"}'
            )
          );
          newRowData.push(
            JSON.parse(
              '{"' +
                header[2].substr(0, header[2].length - 1) +
                '": "' +
                Number.parseInt(lines[line].split("	")[2].substr(0, 4)) +
                '"}'
            )
          );
          var resultRow = {};
          for (var xd = 0; xd < newRowData.length; xd++)
            resultRow = { ...resultRow, ...newRowData[xd] };
          result.push(resultRow);
        }
        return setState(result);
      });
  }, []);

  return (
    <div>
      {result.map((el) => (
        <p>{el}</p>
      ))}
      {peopleCounter}||
      {peoplePercent}
      {console.log(chart)}
      {chart && <Bar data={chart.data} options={chart.options} />}
      <table>
        <tr>
          <button
            onClick={() => {
              var temp = [];
              state
                .filter(function (entry) {
                  return entry.liczba_kobiet < entry.liczba_mezczyzn;
                })
                .map((el) =>
                  temp.push(el.nazwisko + ", " + el.liczba_mezczyzn)
                );
              setResult(temp);
            }}
          >
            NAZWISKA KTORYCH JEST WIECEJ MESKICH
          </button>
          <button
            onClick={() => {
              var temp = 0;
              state.map(
                (el) =>
                  (temp +=
                    Number.parseInt(el.liczba_kobiet) +
                    Number.parseInt(el.liczba_mezczyzn))
              );
              setPeopleCounter(temp);
            }}
          >
            LICZBA OSOB
          </button>
          <button
            onClick={() => {
              var temp = 0;
              var tempar = [];
              var sm = [];
              state
                .sort((a, b) => a.liczba_mezczyzn < b.liczba_mezczyzn)
                .slice(0, 12)
                .map((el) =>
                  sm.push({ nazwisko: el.nazwisko, liczba: el.liczba_mezczyzn })
                );
              var sw = [];
              state
                .sort((a, b) => a.liczba_kobiet < b.liczba_kobiet)
                .slice(0, 12)
                .map((el) => {
                  return sw.push({
                    nazwisko: el.nazwisko,
                    liczba: el.liczba_kobiet,
                  });
                });
              console.log(sw);
              var sorted_ppl = [...sm, ...sw];
              console.log(sorted_ppl);
              sorted_ppl = sorted_ppl.sort((a, b) => a.liczba < b.liczba);
              var tempRes = [];
              console.log(
                sorted_ppl.filter(
                  (v, i, a) =>
                    a.findIndex(
                      (t) =>
                        JSON.stringify(t.nazwisko) ===
                        JSON.stringify(v.nazwisko)
                    ) === i
                )
              );
              sorted_ppl
                .sort((a, b) => a.liczba < b.liczba)
                .slice(0, 12)
                .sort((a, b) => a.nazwisko > b.nazwisko)
                .map((el) => {
                  return tempRes.push(el.nazwisko + " " + el.liczba);
                });
              setResult(tempRes);
              console.log(result);
            }}
          >
            NAJBARDZIEJ POPULARNE NAZWISKA W KRAJU
          </button>
          <button
            onClick={() => {
              var temp = 0;
              var pplcounter = 0;
              state.map(
                (el) =>
                  (pplcounter +=
                    Number.parseInt(el.liczba_kobiet) +
                    Number.parseInt(el.liczba_mezczyzn))
              );
              state
                .filter(
                  (el) =>
                    el.nazwisko.includes("ski") || el.nazwisko.includes("ska")
                )
                .map(
                  (el) =>
                    (temp +=
                      Number.parseInt(el.liczba_kobiet) +
                      Number.parseInt(el.liczba_mezczyzn))
                );
              console.log(pplcounter);
              console.log(temp);
              var resultPercent = ((temp / pplcounter) * 100).toFixed(1);
              setPeoplePercent(resultPercent);
            }}
          >
            PROCENT LICZBY MIESZKANCOW Z KONCOWKA -SKI
          </button>
          <button
            onClick={() => {
              var pplcounter = 0;
              state.map(
                (el) =>
                  (pplcounter +=
                    Number.parseInt(el.liczba_kobiet) +
                    Number.parseInt(el.liczba_mezczyzn))
              );
              var twentyPercentOfPpl = 0.2 * pplcounter;
              console.log(pplcounter);
              var tempNumber = 0;
              var peopleList = [];
              state
                .sort((a, b) => {
                  var liczbaA =
                    Number.parseInt(a.liczba_kobiet) +
                    Number.parseInt(a.liczba_mezczyzn);
                  var liczbaB =
                    Number.parseInt(b.liczba_kobiet) +
                    Number.parseInt(b.liczba_mezczyzn);
                  if (liczbaA > liczbaB) {
                    return false;
                  } else {
                    return true;
                  }
                })
                .map((el) => {
                  var liczba =
                    Number.parseInt(el.liczba_kobiet) +
                    Number.parseInt(el.liczba_mezczyzn);
                  if (tempNumber + liczba <= twentyPercentOfPpl) {
                    tempNumber += liczba;
                    peopleList.push(el);
                    return "";
                  } else {
                    return "";
                  }
                });

              console.log(peopleList);
              var labels = [];
              var series = [];
              var min,
                max = 0;
              peopleList.map((el) => {
                if (
                  Number.parseInt(el.liczba_mezczyzn) +
                    Number.parseInt(el.liczba_kobiet) >
                  max
                )
                  max =
                    Number.parseInt(el.liczba_mezczyzn) +
                    Number.parseInt(el.liczba_kobiet);
                if (
                  min >=
                  Number.parseInt(el.liczba_mezczyzn) +
                    Number.parseInt(el.liczba_kobiet)
                )
                  min =
                    Number.parseInt(el.liczba_mezczyzn) +
                    Number.parseInt(el.liczba_kobiet);
                labels.push(el.nazwisko);
                series.push(
                  Number.parseInt(el.liczba_mezczyzn) +
                    Number.parseInt(el.liczba_kobiet)
                );
                return "";
              });
              var bgColors = [];
              var vColors = [];
              const ColumnColor = (pplcount) => {
                // alert(pplcounter);

                var color = "";
                console.log(pplcounter);
                console.log(pplcount + ", " + pplcounter * 0.05);
                // if (pplcount > twentyPercentOfPpl) color = "red";
                console.log(0.1 * pplcounter);
                if (
                  pplcount > 0.1 * pplcounter &&
                  pplcount <= twentyPercentOfPpl
                ) {
                  console.log("true");
                } else {
                  console.log("false");
                }
                color = "green";
                // if (pplcount > 0.1 * pplcounter && pplcount < 0.15 * pplcounter)
                //   color = "blue";
                // if (pplcount > 0.5 * pplcounter && pplcount < 0.1 * pplcounter)
                //   color = "yellow";
                console.log(color);
              };
              series.map((e) => {
                vColors.push("rgba(255, 99, 132, 1)");
                console.log(ColumnColor(e));
                bgColors.push("rgba(255, 99, 132, 1)");
                return "";
              });
              const data = {
                labels: labels,
                datasets: [
                  {
                    label:
                      "Laczna liczba osob(20% calego kraju) z danym nazwiskiem",
                    data: series,
                    backgroundColor: bgColors,
                    borderColor: vColors,
                    borderWidth: 1,
                  },
                ],
              };
              const options = {
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              };
              console.log(data);
              console.log(max);
              setChart({ data, options });
            }}
          >
            WYKRES NAZWISK 20%
          </button>
        </tr>
      </table>
    </div>
  );
};

export default Imiennicy;
