"use client";

import { StaticTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const [time, setTime] = useState(dayjs().startOf("hour"));
  const [isWakeUpMode, setIsWakeUpMode] = useState(false);
  const [vigilia] = useState(15);
  const [currentTime, setCurrentTime] = useState(dayjs());

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

  const totalMinutes = time.hour() * 60 + time.minute();
  const fases = Array.from({ length: 6 }, (_, i) => {
    const ciclos = 90 * (i + 1);

    if (isWakeUpMode) {
      const minutosFase = totalMinutes - ciclos;
      const horarioAjustado = (minutosFase + 1440) % 1440;
      return {
        horario: minutesToTime(horarioAjustado),
        nome: `Ciclo ${i + 1}${i >= 4 ? " (recomendado)" : ""}`,
        icone: 6 - i < 4 ? "moon" : "sun",
      };
    } else {
      const minutosFase = totalMinutes + ciclos + vigilia;
      const horarioAjustado = minutosFase % 1440;
      return {
        horario: minutesToTime(horarioAjustado),
        nome: `Ciclo ${i + 1}${i >= 4 ? " (recomendado)" : ""}`,
        icone: i < 3 ? "moon" : "sun",
      };
    }
  });

  const now = new Date();
  const weekday = now.toLocaleDateString("pt-BR", { weekday: "long" });
  const month = now.toLocaleDateString("pt-BR", { month: "long" });
  const day = now.getDate();

  const handleGoToBedNow = () => {
    setTime(dayjs());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000); // ou 60000 se quiser atualizar a cada minuto

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen py-12  flex flex-col gap-5 justify-center items-center bg relative">
      <div className="flex items-center justify-center ">
        <span className="  text-white font-semibold text-lg capitalize  ">
          {weekday}, {month} {day}
        </span>

        <div className="absolute top-3 right-3 flex flex-col items-center  gap-2 text-white">
          <span className="font-semibold">
            {isWakeUpMode ? "Acordar" : "Dormir"}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isWakeUpMode}
              onChange={() => setIsWakeUpMode(!isWakeUpMode)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <StaticTimePicker
          value={time}
          onChange={handleTimeChange}
          className="!bg-transparent !text-white"
          ampm={false}
        />
      </LocalizationProvider>

      {/*    <div className="flex gap-2 items-center justify-center text-white">
        <p>tempo que levo para dormir:</p>
        <input
          type="number"
          max={59}
          min={1}
          value={vigilia}
          onChange={(e) => setVigilia(Number(e.target.value))}
          className="w-12 bg-transparent text-white outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <p>minutos</p>
      </div> */}

      <button onClick={handleGoToBedNow} className="button">
        <div className="blob1"></div>
        <div className="blob2"></div>
        <div className="inner">
          {isWakeUpMode
            ? `Levantar agora: ${currentTime.format("HH:mm")}`
            : `Ir para a cama agora: ${currentTime.format("HH:mm")}`}
        </div>
      </button>

      <div className="text-center">
        {!isWakeUpMode && (
          <p className="text-white font-semibold">
            Consideramos um média de 15 minutos até você dormir.
          </p>
        )}

        <p className="text-white font-semibold">
          Uma boa noite de sono consiste em 5-6 ciclos de 90 minutos.
        </p>

        <p className="text-white font-semibold text-center px-6 mt-4">
          {isWakeUpMode
            ? "Se você dormir em um desses horários, completará ciclos de sono antes de acordar."
            : "Se você acordar em um desses horários, completará ciclos de sono completos."}{" "}
          <br />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center px-6 w-full md:w-[70%]">
        {fases
          .slice()
          .reverse()
          .map((fase, index) => (
            <div key={index} className="card !md:w-[380px]">
              <div className="flex items-center justify-end px-4">
                {fase.icone === "moon" ? (
                  <Moon size={24} color="white" />
                ) : (
                  <Sun size={24} color="white" />
                )}
              </div>

              <p className="time-text">{fase.horario}</p>
              <p className="day-text">{fase.nome}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
