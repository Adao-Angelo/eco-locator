"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { RecyclingPointsService } from "@/lib/supabase/services/recycling-points-service";
import { Clock, MapPin, Phone, Plus } from "lucide-react";
import { useState } from "react";

const materialOptions = [
  "plastic",
  "glass",
  "electronics",
  "paper",
  "metal",
  "batteries",
] as const;

type MaterialType = (typeof materialOptions)[number];

export default function AddPointModal() {
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

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="bg-zinc-900 text-white border border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Plus size={20} />
            Add New Recycling Point
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-emerald-400">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Point Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Central Recycling Station"
                  className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                  value={formData.name}
                  onChange={(event) =>
                    handleInputChange("name", event.target.value)
                  }
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-sm">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium">
                  Contact
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
                  <Input
                    id="contact"
                    placeholder="(11) 9999-8888"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                    value={formData.contact}
                    onChange={(event) =>
                      handleInputChange("contact", event.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
                <Input
                  id="address"
                  placeholder="São Paulo, 1000 - Luanda, SP"
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                  value={formData.address}
                  onChange={(event) =>
                    handleInputChange("address", event.target.value)
                  }
                />
              </div>
              {validationErrors.address && (
                <p className="text-red-400 text-sm">
                  {validationErrors.address}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-emerald-400">Location</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm font-medium">
                  Latitude *
                </Label>
                <Input
                  id="latitude"
                  placeholder="-23.5505"
                  className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                  value={formData.latitude}
                  onChange={(event) =>
                    handleInputChange("latitude", event.target.value)
                  }
                />
                {validationErrors.latitude && (
                  <p className="text-red-400 text-sm">
                    {validationErrors.latitude}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm font-medium">
                  Longitude *
                </Label>
                <Input
                  id="longitude"
                  placeholder="-46.6333"
                  className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                  value={formData.longitude}
                  onChange={(event) =>
                    handleInputChange("longitude", event.target.value)
                  }
                />
                {validationErrors.longitude && (
                  <p className="text-red-400 text-sm">
                    {validationErrors.longitude}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Operating Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-emerald-400">
              Operating Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="operating_hours" className="text-sm font-medium">
                Operating Hours *
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
                <Input
                  id="operating_hours"
                  placeholder="08:00-18:00"
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                  value={formData.operating_hours}
                  onChange={(event) =>
                    handleInputChange("operating_hours", event.target.value)
                  }
                />
              </div>
              {validationErrors.operating_hours && (
                <p className="text-red-400 text-sm">
                  {validationErrors.operating_hours}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-emerald-400">
              Materials Accepted *
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {materialOptions.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={material}
                    checked={selectedMaterials.includes(material)}
                    onCheckedChange={() => handleMaterialToggle(material)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <Label
                    htmlFor={material}
                    className="text-sm font-normal capitalize cursor-pointer flex-1"
                  >
                    {material}
                  </Label>
                </div>
              ))}
            </div>

            {validationErrors.materials && (
              <p className="text-red-400 text-sm">
                {validationErrors.materials}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-base font-medium"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Point...
              </>
            ) : (
              "Create Recycling Point"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
