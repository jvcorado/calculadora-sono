"use client";

import { StaticTimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

export default function Home() {
  const [time, setTime] = useState(dayjs().startOf("hour"));

  const handleTimeChange = (newTime: dayjs.Dayjs | null) => {
    if (newTime) {
      setTime(newTime);
    }
  };

  // Função para converter minutos em HH:MM
  const minutesToTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Calcula os horários das fases dinamicamente
  const totalMinutes = time.hour() * 60 + time.minute();
  const fases = Array.from({ length: 6 }, (_, i) => {
    const minutosFase = totalMinutes + 90 * (i + 1);
    return {
      horario: minutesToTime(minutosFase),
      nome: `Ciclo ${i + 1}${i >= 3 ? " (recomendado)" : ""}`,
      icone: i < 3 ? "moon" : "sun",
    };
  });

  const now = new Date();
  const weekday = now.toLocaleDateString("pt-BR", { weekday: "long" });
  const month = now.toLocaleDateString("pt-BR", { month: "long" });
  const day = now.getDate();

  const handleGoToBedNow = () => {
    setTime(dayjs());
  };

  return (
    <div className="w-full min-h-screen py-12 md:py-36 flex flex-col gap-8 justify-center items-center bg">
      <span className="text-white font-semibold text-lg capitalize">
        {weekday}, {month} {day}
      </span>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DemoItem>
          <StaticTimePicker
            value={time}
            onChange={handleTimeChange}
            className="!bg-transparent !text-white "
          />
        </DemoItem>
      </LocalizationProvider>

      <button onClick={handleGoToBedNow} className="button">
        <div className="blob1"></div>
        <div className="blob2"></div>
        <div className="inner">Ir para a cama agora</div>
      </button>

      <p className="text-white text-center px-6">
        Se você acordar em um desses horários, você vai acordar entre ciclos de
        sono de 90 minutos. Uma boa noite de sono consiste em 5-6 ciclos
        completos de sono.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center px-6 w-full md:w-[70%]">
        {fases
          .slice()
          .reverse()
          .map((fase, index) => (
            <div key={index} className="card !md:w-[380px]">
              <p className="time-text">{fase.horario}</p>
              <p className="day-text">{fase.nome}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                strokeWidth="0"
                fill="currentColor"
                stroke="currentColor"
                className={fase.icone}
              >
                {fase.icone === "moon" ? (
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                ) : (
                  <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                )}
              </svg>
            </div>
          ))}
      </div>
    </div>
  );
}
