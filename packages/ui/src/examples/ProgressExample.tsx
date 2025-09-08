import { useEffect, useState } from 'react';
import { Progress } from '../components/ui/progress.js';

export function ProgressExample() {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);

  useEffect(() => {
    const downloadTimer = setTimeout(() => {
      setDownloadProgress((prevProgress) => {
        return prevProgress >= 100 ? 0 : prevProgress + 5;
      });
    }, 1000);

    const uploadTimer = setTimeout(() => {
      setUploadProgress((prevProgress) => {
        return prevProgress >= 100 ? 0 : prevProgress + 10;
      });
    }, 1500);

    const installTimer = setTimeout(() => {
      setInstallProgress((prevProgress) => {
        return prevProgress >= 100 ? 0 : prevProgress + 15;
      });
    }, 2000);

    return () => {
      clearTimeout(downloadTimer);
      clearTimeout(uploadTimer);
      clearTimeout(installTimer);
    };
  }, [downloadProgress, uploadProgress, installProgress]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Progress Examples</h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 border rounded-md bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-700">Download Progress</h3>
                <span className="text-blue-600 font-medium">{downloadProgress}%</span>
              </div>
              <Progress
                value={downloadProgress}
                className="h-2 bg-blue-100"
                indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-blue-600">0%</span>
                <span className="text-xs text-blue-600">100%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-700">Upload Progress</h3>
                <span className="text-green-600 font-medium">{uploadProgress}%</span>
              </div>
              <Progress
                value={uploadProgress}
                className="h-3 bg-green-100 rounded-full"
                indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-green-600">Starting</span>
                <span className="text-xs text-green-600">Complete</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold text-purple-700">Installation Progress</h3>
                <span className="text-purple-600 font-medium">{installProgress}%</span>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                      {installProgress < 30
                        ? 'Preparing'
                        : installProgress < 70
                          ? 'Installing'
                          : 'Finalizing'}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-purple-200">
                  <div
                    style={{ width: `${installProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-in-out"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
