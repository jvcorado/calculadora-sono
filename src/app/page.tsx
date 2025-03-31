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
    const horas = Math.floor(ciclos / 60);
    const minutos = ciclos % 60;
    const duracao = `${horas}h${minutos > 0 ? minutos : ""}`;

    if (isWakeUpMode) {
      const minutosFase = totalMinutes - ciclos - 15;
      const horarioAjustado = (minutosFase + 1440) % 1440;
      return {
        horario: minutesToTime(horarioAjustado),
        nome: `Ciclo ${i + 1}${i >= 4 ? " (recomendado)" : ""}`,
        icone: 6 - i < 4 ? "moon" : "sun",
        duracao,
      };
    } else {
      const minutosFase = totalMinutes + ciclos + vigilia;
      const horarioAjustado = minutosFase % 1440;
      return {
        horario: minutesToTime(horarioAjustado),
        nome: `Ciclo ${i + 1}${i >= 4 ? " (recomendado)" : ""}`,
        icone: i < 3 ? "moon" : "sun",
        duracao,
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

  // Atualiza hora atual
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Solicita permissão para notificação
  /*  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []); */

  // Define alarme com base no horário do ciclo
  /*   const handleSetAlarm = (horario: string) => {
    const [hour, minute] = horario.split(":").map(Number);
    const now = dayjs();
    let alarmTime = now.hour(hour).minute(minute).second(0);

    if (alarmTime.isBefore(now)) {
      alarmTime = alarmTime.add(1, "day");
    }

    const msUntilAlarm = alarmTime.diff(now);

    alert(`Alarme definido para ${alarmTime.format("HH:mm")}`);

    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("⏰ Ciclo de sono!", {
          body: `Chegou a hora: ${alarmTime.format("HH:mm")}`,
        });
      } else {
        alert(`⏰ Chegou a hora: ${alarmTime.format("HH:mm")}`);
      }
    }, msUntilAlarm);
  };
 */
  return (
    <div className="w-full min-h-screen py-12 flex flex-col gap-5 justify-center items-center bg relative">
      <div className="flex items-center justify-center">
        <span className="text-white font-semibold text-lg capitalize">
          {weekday}, {month} {day}
        </span>

        <div className="absolute top-3 right-3 flex flex-col items-center gap-2 text-white">
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

      <button onClick={handleGoToBedNow} className="button">
        <div className="blob1"></div>
        <div className="blob2"></div>
        <div className="inner">
          {isWakeUpMode
            ? `Levantar agora: ${currentTime.format("HH:mm")}`
            : `Ir para a cama agora: ${currentTime.format("HH:mm")}`}
        </div>
      </button>

      <div className="text-center px-6">
        <p className="md:hidden block text-white text-sm font-semibold">
          Consideramos uma média de <br />
          15 minutos até você dormir.
        </p>
        {/*   <p className="md:hidden block text-white text-sm font-semibold">
          Uma boa noite de sono consiste entre <br /> 5-6 ciclos de 90 minutos.
        </p> */}

        <p className="hidden md:block text-white text-sm font-semibold">
          Consideramos uma média de 15 minutos até você dormir.
        </p>
        <p className="hidden md:block text-white text-sm font-semibold">
          Uma boa noite de sono consiste entre 5-6 ciclos de 90 minutos.
        </p>

        <p className="text-white font-semibold text-center mt-4">
          {isWakeUpMode
            ? "Se você dormir em um desses horários, completará ciclos de sono antes de acordar."
            : "Se você acordar em um desses horários, completará ciclos de sono completos."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center px-6 w-full md:w-[70%]">
        {fases
          .slice()
          .reverse()
          .map((fase, index) => (
            <div
              key={index}
              /*    onClick={() => handleSetAlarm(fase.horario)} */
              className="card !md:w-[380px] cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
            >
              <div className="flex items-center justify-end px-4">
                {fase.icone === "moon" ? (
                  <Moon size={24} color="white" />
                ) : (
                  <Sun size={24} color="white" />
                )}
              </div>

              <div className="flex items-end gap-2">
                <p className="time-text">{fase.horario}</p>
                <p className="pb-3.5">{fase.duracao}</p>
              </div>

              <p className="day-text">{fase.nome}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
