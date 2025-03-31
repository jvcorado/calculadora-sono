/* "use client";

import { useState, useEffect } from "react";
import { StaticTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ChevronRight } from "lucide-react";

export default function MedicineApp() {
  const [medicines, setMedicines] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("medicines");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [name, setName] = useState("");
  const [firstDoseTime, setFirstDoseTime] = useState(dayjs().startOf("hour"));
  const [intervalHours, setIntervalHours] = useState(8);
  const [daysCount, setDaysCount] = useState(7);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("medicines", JSON.stringify(medicines));
  }, [medicines]);

  const handleAddMedicine = () => {
    if (!name.trim()) {
      setErrors("Nome do remédio é obrigatório.");
      return;
    }
    if (intervalHours < 1 || daysCount < 1) {
      setErrors("Intervalo e número de dias devem ser maiores que 0.");
      return;
    }

    setErrors(null);
    setIsBlocked(true);

    const totalHours = daysCount * 24;
    const totalDoses = Math.floor(totalHours / intervalHours);
    const doses = [];
    const createdAt = dayjs().locale("pt-br").format("dddd, DD/MM/YYYY HH:mm");

    for (let i = 0; i < totalDoses; i++) {
      const doseTime = firstDoseTime.add(i * intervalHours, "hour");
      doses.push({
        horario: doseTime.format("HH:mm"),
        dia: doseTime.locale("pt-br").format("dddd, DD/MM/YYYY"),
        id: doseTime.format("YYYY-MM-DD-HH-mm"),
        taken: false,
      });
    }

    const newMedicine = {
      id: Date.now(),
      name,
      intervalHours,
      firstDoseTime: firstDoseTime.format("HH:mm"),
      createdAt,
      doses,
    };

    setMedicines((prev) => {
      const updated = [...prev, newMedicine];
      setSelectedMedicine(newMedicine);
      return updated;
    });

    setName("");
    setIntervalHours(8);
    setDaysCount(7);
    setFirstDoseTime(dayjs().startOf("hour"));
  };

  const toggleDoseTaken = (medicineId, doseId) => {
    setMedicines((prev) => {
      const updated = prev.map((med) => {
        if (med.id === medicineId) {
          const updatedDoses = med.doses.map((dose) =>
            dose.id === doseId ? { ...dose, taken: !dose.taken } : dose
          );
          if (selectedMedicine?.id === medicineId) {
            setSelectedMedicine({ ...med, doses: updatedDoses });
          }
          return { ...med, doses: updatedDoses };
        }
        return med;
      });
      return updated;
    });
  };

  const takeNow = (medicineId) => {
    const now = dayjs();
    const nowId = now.format("YYYY-MM-DD-HH-mm");

    setMedicines((prev) => {
      const updated = prev.map((med) => {
        if (med.id === medicineId) {
          const updatedDoses = med.doses.map((dose) =>
            dose.id === nowId ? { ...dose, taken: true } : dose
          );
          if (selectedMedicine?.id === medicineId) {
            setSelectedMedicine({ ...med, doses: updatedDoses });
          }
          return { ...med, doses: updatedDoses };
        }
        return med;
      });
      return updated;
    });
  };

  const deleteMedicine = (medicineId) => {
    const updated = medicines.filter((med) => med.id !== medicineId);
    setMedicines(updated);
    if (selectedMedicine?.id === medicineId) setSelectedMedicine(null);
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black font-sans max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Olá, Princesa! 👑</h1>

        <div className="bg-gray-100 p-4 rounded-xl shadow-md">
          {errors && <p className="text-red-600 text-sm mb-2">{errors}</p>}

          <div className="mb-2">
            <label className="text-sm font-medium">Nome do remédio:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-1 rounded-md border"
            />
          </div>

          <div className="mb-2">
            <label className="text-sm font-medium">
              Horário da primeira dose:
            </label>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <StaticTimePicker
                value={firstDoseTime}
                onChange={(newTime) => newTime && setFirstDoseTime(newTime)}
                ampm={false}
                className="!bg-white mt-1 rounded-lg shadow-md"
              />
            </LocalizationProvider>
          </div>

          <div className="mb-2">
            <label className="text-sm font-medium">
              Intervalo entre doses (em horas):
            </label>
            <input
              type="number"
              min={1}
              value={intervalHours}
              onChange={(e) => setIntervalHours(Number(e.target.value))}
              className="w-full p-2 mt-1 rounded-md border"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Por quantos dias:</label>
            <input
              type="number"
              min={1}
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full p-2 mt-1 rounded-md border"
            />
          </div>

          <button
            onClick={handleAddMedicine}
            className="w-full bg-blue-600 text-white py-2 rounded-md"
            disabled={isBlocked}
          >
            Cadastrar Remédio
          </button>
        </div>
      </div>

      {selectedMedicine ? (
        <div className="mb-8">
          <button
            onClick={() => setSelectedMedicine(null)}
            className="text-sm text-blue-500 mb-4 hover:underline"
          >
            ← Voltar para lista
          </button>
          <h2 className="text-xl font-bold mb-2">{selectedMedicine.name}</h2>
          <p className="text-sm text-gray-600 mb-2">
            Criado em {selectedMedicine.createdAt}
          </p>
          <div className="space-y-2">
            {selectedMedicine.doses.map((dose, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-xl shadow-sm transition ${
                  dose.taken ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <div>
                  <p className="font-semibold">{dose.horario}</p>
                  <p className="text-xs">{dose.dia}</p>
                </div>
                <button
                  onClick={() => toggleDoseTaken(selectedMedicine.id, dose.id)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    dose.taken ? "bg-green-600" : "bg-blue-600"
                  } text-white`}
                >
                  {dose.taken ? "Tomada" : "Marcar como tomada"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {medicines.map((med) => {
            const dosesTaken = med.doses.filter((d) => d.taken).length;
            return (
              <div
                key={med.id}
                className="bg-gray-100 p-4 rounded-xl shadow-md flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedMedicine(med)}
              >
                <div>
                  <h3 className="text-lg font-semibold">{med.name}</h3>
                  <p className="text-xs text-gray-600">
                    Criado em {med.createdAt} · Dose: {med.firstDoseTime} ·
                    Intervalo: {med.intervalHours}h
                  </p>
                  <p className="text-xs text-gray-600">
                    Doses concluídas: {dosesTaken}/{med.doses.length}
                  </p>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
 */
