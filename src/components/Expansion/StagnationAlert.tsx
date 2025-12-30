import { AlertTriangle } from 'lucide-react';

interface StagnationAlertProps {
    show: boolean;
}

const StagnationAlert = ({ show }: StagnationAlertProps) => {
    if (!show) return null;

    return (
        <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-medium text-sm">Neural grooves are deep</p>
                <p className="text-xs text-orange-400/80 mt-1">
                    7 consecutive Building days with no micro-novelty. Add a pattern break—new knowledge, conversation, or method.
                </p>
            </div>
        </div>
    );
};

export default StagnationAlert;
