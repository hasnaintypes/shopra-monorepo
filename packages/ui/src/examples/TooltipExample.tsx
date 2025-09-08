import { Button } from '../components/ui/button.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip.js';

export function TooltipExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Tooltip Examples</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-md bg-blue-50 flex flex-col items-center justify-center gap-2">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Basic Tooltip</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="border-blue-500 text-blue-700">
                  Hover Me
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-blue-600 text-white">
                <p>This is a basic tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="p-6 border rounded-md bg-purple-50 flex flex-col items-center justify-center gap-2">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">Styled Tooltip</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="border-purple-500 text-purple-700">
                  Information
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
                <p>Important information about this feature</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="p-6 border rounded-md bg-green-50 flex flex-col items-center justify-center gap-2">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Help Tooltip</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="border-green-500 text-green-700 rounded-full w-10 h-10 p-0"
                >
                  ?
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-green-600 text-white max-w-xs">
                <p>Need help? Contact our support team for assistance with this feature.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
