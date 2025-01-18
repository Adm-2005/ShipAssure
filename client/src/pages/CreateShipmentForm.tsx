import React, { useState } from "react";

// Define the FormData type with 'mode' added
type FormData = {
    origin_code: string;
    origin_city: string;
    origin_country: string;
    destination_code: string;
    destination_city: string;
    destination_country: string;
    cargo_load: number;
    mode: string[]; // Added 'mode' here
};

const transportModes = ["Air ways", "Water ways", "Railways", "Roadways"];

const ShipmentCreationForm = () => {
    const [selectedModes, setSelectedModes] = useState<string[]>([]);
    const [submitStatus, setSubmitStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        origin_code: "",
        origin_city: "",
        origin_country: "",
        destination_code: "",
        destination_city: "",
        destination_country: "",
        cargo_load: 0,
        mode: [], // Initialize 'mode' as an empty array
    });

    const [errors, setErrors] = useState<any>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        let valid = true;

        // Validate form fields
        const newErrors: Record<string, string> = {}; // Define the type for newErrors as an object with string keys and string values

        Object.keys(formData).forEach((key) => {
            // Make sure the key is of type keyof FormData to avoid the error
            if (key !== "mode" && !formData[key as keyof FormData]) {
                newErrors[key] = "This field is required";
                valid = false;
            }
        });

        // Validate 'cargo_load' to ensure it's a number
        if (isNaN(formData.cargo_load) || formData.cargo_load <= 0) {
            newErrors.cargo_load = "Cargo load must be a valid number greater than 0";
            valid = false;
        }

        if (selectedModes.length === 0) {
            newErrors.mode = "Select at least one mode";
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) return;

        setSubmitStatus("loading");
        setErrorMessage(null);

        try {
            const response = await fetch("/api/shipments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    mode: selectedModes,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create shipment");
            }

            setSubmitStatus("success");
        } catch (error) {
            setSubmitStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value === "" ? "" : id === "cargo_load" ? parseInt(value) : value,  // Ensure cargo_load is parsed as an integer
        }));
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white border rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Create New Shipment</h2>
            <p className="mb-6 text-lg text-gray-600">
                Enter the details for your new shipment below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Origin Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="origin_code" className="block text-sm font-medium text-gray-700">
                            Origin Postal Code
                        </label>
                        <input
                            id="origin_code"
                            type="text"
                            value={formData.origin_code}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500"
                        />
                        {errors.origin_code && <span className="text-red-500 text-sm">{errors.origin_code}</span>}
                    </div>
                    <div>
                        <label htmlFor="origin_city" className="block text-sm font-medium text-gray-700">
                            Origin City
                        </label>
                        <input
                            id="origin_city"
                            type="text"
                            value={formData.origin_city}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500"
                        />
                        {errors.origin_city && <span className="text-red-500 text-sm">{errors.origin_city}</span>}
                    </div>
                    <div>
                        <label htmlFor="origin_country" className="block text-sm font-medium text-gray-700">
                            Origin Country
                        </label>
                        <input
                            id="origin_country"
                            type="text"
                            value={formData.origin_country}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500"
                        />
                        {errors.origin_country && <span className="text-red-500 text-sm">{errors.origin_country}</span>}
                    </div>
                </div>

                {/* Destination Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="destination_code" className="block text-sm font-medium text-gray-700">
                            Destination Postal Code
                        </label>
                        <input
                            id="destination_code"
                            type="text"
                            value={formData.destination_code}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500"
                        />
                        {errors.destination_code && <span className="text-red-500 text-sm">{errors.destination_code}</span>}
                    </div>
                    <div>
                        <label htmlFor="destination_city" className="block text-sm font-medium text-gray-700">
                            Destination City
                        </label>
                        <input
                            id="destination_city"
                            type="text"
                            value={formData.destination_city}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500"
                        />
                        {errors.destination_city && <span className="text-red-500 text-sm">{errors.destination_city}</span>}
                    </div>
                    <div>
                        <label htmlFor="destination_country" className="block text-sm font-medium text-gray-700">
                            Destination Country
                        </label>
                        <input
                            id="destination_country"
                            type="text"
                            value={formData.destination_country}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500"
                        />
                        {errors.destination_country && <span className="text-red-500 text-sm">{errors.destination_country}</span>}
                    </div>
                </div>

                {/* Transportation Mode */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Transportation Mode</label>
                    <div className="flex gap-4">
                        {transportModes.map((mode) => (
                            <div key={mode} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={mode}
                                    checked={selectedModes.includes(mode)}
                                    onChange={(e) => {
                                        setSelectedModes((prev) =>
                                            e.target.checked ? [...prev, mode] : prev.filter((m) => m !== mode)
                                        );
                                    }}
                                />
                                <label htmlFor={mode} className="text-sm font-medium text-gray-700">
                                    {mode}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.mode && <span className="text-red-500 text-sm">{errors.mode}</span>}
                </div>

                {/* Cargo Load */}
                <div>
                    <label htmlFor="cargo_load" className="block text-sm font-medium text-gray-700">
                        Cargo Load
                    </label>
                    <input
                        id="cargo_load"
                        type="text"
                        value={formData.cargo_load}
                        onChange={handleChange}
                        className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500"
                    />
                    {errors.cargo_load && <span className="text-red-500 text-sm">{errors.cargo_load}</span>}
                </div>


                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                    disabled={submitStatus === "loading"}
                >
                    {submitStatus === "loading" ? "Creating..." : "Create Shipment"}
                </button>
            </form>

            {/* Error and Success Messages */}
            {submitStatus === "error" && (
                <div className="text-red-500 mt-4">
                    <p>{errorMessage}</p>
                </div>
            )}
            {submitStatus === "success" && (
                <div className="text-green-500 mt-4">
                    <p>Your shipment has been created successfully!</p>
                </div>
            )}
        </div>
    );
};

export default ShipmentCreationForm;