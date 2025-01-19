import { FormSectionProps } from '../../utils/typings';

const FormSection: React.FC<FormSectionProps> = ({
  formData,
  setFormData,
  handleSubmit,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cargo_load' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <section className="flex flex-col gap-7 max-w-md lg:w-[500px] p-6 mx-auto my-[40px] rounded-md bg-[#DBEAFE]">
      <div className="flex flex-col items-center gap-1 mx-auto">
        <h2 className="text-2xl lg:text-3xl text-[#0E76FD] font-bold">Create Shipment</h2>
        <p className="text-md">Ship your products with a single click.</p>
      </div>
      <form onSubmit={(e) => {
        handleSubmit(e)
      }} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="origin_code" className="text-md text-[#0E76FD] font-semibold">
            Origin Postal Code*
          </label>
          <input
            id="origin_code"
            name="origin_code"
            type="text"
            value={formData.origin_code}
            onChange={handleChange}
            className="p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="destination_code" className="text-md text-[#0E76FD] font-semibold">
            Destination Postal Code*
          </label>
          <input
            id="destination_code"
            name="destination_code"
            type="text"
            value={formData.destination_code}
            onChange={handleChange}
            className="p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-md text-[#0E76FD] font-semibold">Cargo Load*</label>
          <input
            type="number"
            id="cargo_load"
            name="cargo_load"
            value={formData.cargo_load}
            onChange={handleChange}
            className="p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none"
            step="any"
          />
        </div>

        {error && <span className="text-red-700">{error}</span>}

        <button
          type="submit"
          className="px-4 py-2 mt-4 rounded-md text-lg bg-[#0E76FD] hover:bg-[#3E76FD] w-[150px] lg:w-[200px] mx-auto text-white"
        >
          Create
        </button>
      </form>
    </section>
  );
};

export default FormSection;
