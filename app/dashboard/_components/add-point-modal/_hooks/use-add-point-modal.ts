import { useDashboardStore } from "@/lib/store/dashboard-store";
import { RecyclingPointsService } from "@/lib/supabase/services/recycling-points-service";
import type { MaterialType } from "@/types";
import { useState } from "react";

export default function useAddPointModal() {
  const {
    openModal,
    setOpenModal,
    user,
    formData,
    setFormData,
    selectedMaterials,
    setSelectedMaterials,
    submitting,
    setSubmitting,
    resetForm,
    addRecyclingPoint,
  } = useDashboardStore();

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Point name is required";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.latitude.trim()) {
      errors.latitude = "Latitude is required";
    } else if (
      isNaN(parseFloat(formData.latitude)) ||
      parseFloat(formData.latitude) < -90 ||
      parseFloat(formData.latitude) > 90
    ) {
      errors.latitude = "Latitude must be a valid number between -90 and 90";
    }

    if (!formData.longitude.trim()) {
      errors.longitude = "Longitude is required";
    } else if (
      isNaN(parseFloat(formData.longitude)) ||
      parseFloat(formData.longitude) < -180 ||
      parseFloat(formData.longitude) > 180
    ) {
      errors.longitude =
        "Longitude must be a valid number between -180 and 180";
    }

    if (!formData.operating_hours.trim()) {
      errors.operating_hours = "Operating hours are required";
    }

    if (selectedMaterials.length === 0) {
      errors.materials = "Please select at least one material";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMaterialToggle = (material: MaterialType) => {
    const updatedMaterials = selectedMaterials.includes(material)
      ? selectedMaterials.filter(
          (selectedMaterial) => selectedMaterial !== material
        )
      : [...selectedMaterials, material];

    setSelectedMaterials(updatedMaterials);

    if (validationErrors.materials) {
      setValidationErrors((currentErrors) => ({
        ...currentErrors,
        materials: "",
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ [field]: value });

    if (validationErrors[field]) {
      setValidationErrors((currentErrors) => ({
        ...currentErrors,
        [field]: "",
      }));
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      alert("Please log in to create recycling points");
      return;
    }

    setSubmitting(true);

    try {
      const newPoint = {
        name: formData.name,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        operating_hours: formData.operating_hours,
        contact: formData.contact,
        status: formData.status,
        materials: selectedMaterials,
        created_by: user.id,
      };

      const createdPoint = await RecyclingPointsService.createPoint(newPoint);
      addRecyclingPoint(createdPoint);
      setOpenModal(false);
      resetForm();
      setValidationErrors({});
    } catch (error) {
      console.error("Error creating point:", error);
      alert("Error creating recycling point. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    openModal,
    setOpenModal,
    user,
    formData,
    setFormData,
    selectedMaterials,
    setSelectedMaterials,
    submitting,
    setSubmitting,
    resetForm,
    addRecyclingPoint,
    handleInputChange,
    handleMaterialToggle,
    handleFormSubmit,
    setValidationErrors,
    validationErrors,
  };
}
