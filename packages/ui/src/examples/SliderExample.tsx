import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";

export function SliderExample() {
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(75);
  const [temperature, setTemperature] = useState(22);
  
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Slider Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-md bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Volume Control</h3>
              <div className="flex items-center gap-4">
                <span className="text-blue-600 w-8">{volume}%</span>
                <Slider
                  className="data-[state=active]:bg-blue-500"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                />
                <span className="text-blue-600 w-8">
                  {volume < 30 ? '🔈' : volume < 70 ? '🔉' : '🔊'}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-cyan-700 mb-2">Brightness</h3>
              <div className="flex items-center gap-4">
                <span className="text-cyan-600 w-8">{brightness}%</span>
                <Slider
                  className="data-[state=active]:bg-cyan-500"
                  defaultValue={[75]}
                  max={100}
                  step={1}
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                />
                <span className="text-cyan-600 w-8">
                  {brightness < 30 ? '🌑' : brightness < 70 ? '🌓' : '🌕'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border rounded-md bg-gradient-to-r from-amber-50 to-red-50">
          <div>
            <h3 className="text-lg font-semibold text-amber-700 mb-2">Temperature Control</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-600">❄️ Cool</span>
                <span className="text-amber-600 font-bold">{temperature}°C</span>
                <span className="text-red-600">🔥 Heat</span>
              </div>
              <Slider
                className="data-[state=active]:bg-gradient-to-r from-blue-500 via-amber-500 to-red-500"
                defaultValue={[22]}
                min={16}
                max={30}
                step={0.5}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <div className="h-24 mt-4 rounded-md overflow-hidden" style={{
                background: `linear-gradient(to right, 
                  rgb(59, 130, 246) 0%, 
                  rgb(250, 204, 21) 50%, 
                  rgb(239, 68, 68) 100%)`
              }}>
                <div 
                  className="h-full w-1 bg-black relative transition-all duration-300"
                  style={{
                    marginLeft: `${((temperature - 16) / (30 - 16)) * 100}%`,
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}