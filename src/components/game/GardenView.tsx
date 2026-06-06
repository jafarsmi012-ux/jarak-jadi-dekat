"use client";

import { useEffect, useState } from 'react';
import { Droplets, Coins, Plus } from 'lucide-react';
import * as gameApi from '@/lib/gameApi';
import type { GardenPlant } from '@/types/game';
import { PLANTS } from '@/types/game';

interface GardenViewProps {
  coupleId: string;
  playerName: string;
  playerCoins: number;
}

export default function GardenView({ coupleId, playerName, playerCoins }: GardenViewProps) {
  const [plants, setPlants] = useState<GardenPlant[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGarden();
  }, [coupleId]);

  async function loadGarden() {
    const gardenData = await gameApi.getGarden(coupleId);
    setPlants(gardenData);
    setLoading(false);
  }

  async function handlePlant(plantType: string) {
    const plantDef = PLANTS[plantType];
    if (!plantDef) return;

    if (playerCoins < plantDef.plant_cost) {
      alert('Coins tidak cukup!');
      return;
    }

    if (plants.length >= 6) {
      alert('Taman sudah penuh! (maksimal 6 tanaman)');
      return;
    }

    await gameApi.plantSeed(coupleId, plantType, playerName);
    await loadGarden();
    setShowShop(false);
  }

  async function handleWater(plantId: string) {
    await gameApi.waterPlant(plantId);
    await loadGarden();
  }

  async function handleHarvest(plantId: string, plantType: string) {
    const plantDef = PLANTS[plantType];
    if (!plantDef) return;

    await gameApi.harvestPlant(plantId);
    // TODO: Add coins to player
    await loadGarden();
    alert(`Panen berhasil! +${plantDef.harvest_coins} coins! 🌟`);
  }

  function getPlantGrowthStage(plant: GardenPlant): number {
    const plantDef = PLANTS[plant.plant_type];
    if (!plantDef) return 0;

    const plantedDate = new Date(plant.planted_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));

    return Math.min(daysDiff, plantDef.growth_days);
  }

  function canHarvest(plant: GardenPlant): boolean {
    const plantDef = PLANTS[plant.plant_type];
    if (!plantDef) return false;
    return getPlantGrowthStage(plant) >= plantDef.growth_days;
  }

  function needsWater(plant: GardenPlant): boolean {
    if (!plant.watered_at) return true;
    const wateredDate = new Date(plant.watered_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - wateredDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 12; // Needs water every 12 hours
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-green-700 text-xl">🌱 Taman Kami</h2>
          <button
            onClick={() => setShowShop(!showShop)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tanam
          </button>
        </div>

        {showShop && (
          <div className="mb-4 p-4 bg-green-50 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-3">Toko Benih</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(PLANTS).map(plant => (
                <button
                  key={plant.type}
                  onClick={() => handlePlant(plant.type)}
                  disabled={playerCoins < plant.plant_cost}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    playerCoins >= plant.plant_cost
                      ? 'bg-white border-green-300 hover:border-green-500 hover:shadow-md'
                      : 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-2xl mb-1">{plant.icon}</div>
                  <div className="font-semibold text-sm text-gray-800">{plant.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{plant.growth_days} hari</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Coins className="w-3 h-3" />
                      {plant.plant_cost}
                    </span>
                    <span className="text-green-600 font-medium">→ {plant.harvest_coins}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin text-4xl mb-2">🌱</div>
            Loading garden...
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🪴</div>
            <p>Taman masih kosong</p>
            <p className="text-sm">Tanam benih pertama kalian!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {plants.map(plant => {
              const plantDef = PLANTS[plant.plant_type];
              if (!plantDef) return null;

              const growthStage = getPlantGrowthStage(plant);
              const isReadyToHarvest = canHarvest(plant);
              const needsWatering = needsWater(plant);

              return (
                <div
                  key={plant.id}
                  className="bg-gradient-to-b from-blue-50 to-green-50 rounded-xl p-4 text-center border-2 border-green-200"
                >
                  <div className={`text-4xl mb-2 ${isReadyToHarvest ? 'animate-bounce' : ''}`}>
                    {plantDef.icon}
                  </div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {plantDef.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    oleh {plant.planted_by}
                  </div>

                  <div className="mb-2">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                        style={{ width: `${(growthStage / plantDef.growth_days) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Hari {growthStage}/{plantDef.growth_days}
                    </div>
                  </div>

                  {isReadyToHarvest ? (
                    <button
                      onClick={() => handleHarvest(plant.id, plant.plant_type)}
                      className="w-full py-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-white font-bold rounded-lg text-xs hover:shadow-lg transition-all"
                    >
                      Panen! 🌟
                    </button>
                  ) : needsWatering ? (
                    <button
                      onClick={() => handleWater(plant.id)}
                      className="w-full py-2 bg-blue-400 text-white font-medium rounded-lg text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-1"
                    >
                      <Droplets className="w-3 h-3" />
                      Siram
                    </button>
                  ) : (
                    <div className="text-xs text-green-600 py-2">
                      💧 Sudah disiram
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
