import { Button } from '../../components/ui/Button';

type IndividualTypeStepProps = {
  individualType: 'shipper' | 'carrier' | null;
  setIndividualType: (type: 'shipper' | 'carrier') => void;
  onNext: () => void;
  onBack: () => void;
};

export function IndividualTypeStep({
  individualType,
  setIndividualType,
  onNext,
  onBack,
}: IndividualTypeStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        Are you a shipper or a carrier?
      </h2>
      <div className="flex space-x-4">
        <Button
          onClick={() => setIndividualType('shipper')}
          variant={individualType === 'shipper' ? 'default' : 'outline'}
          className="w-full"
        >
          Shipper
        </Button>
        <Button
          onClick={() => setIndividualType('carrier')}
          variant={individualType === 'carrier' ? 'default' : 'outline'}
          className="w-full"
        >
          Carrier
        </Button>
      </div>
      <div className="flex space-x-4 mt-4">
        <Button onClick={onBack} variant="outline" className="w-full">
          Back
        </Button>
        <Button onClick={onNext} disabled={!individualType} className="w-full">
          Next
        </Button>
      </div>
    </div>
  );
}
