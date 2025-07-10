"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { CarListing, RENTAL_STATUS } from "../types";

interface FormData {
  carName: string;
  price: number;
  servicedDate: string;
  status: RENTAL_STATUS;
  location: string;
}

interface FormErrors {
  carName?: string;
  price?: string;
  servicedDate?: string;
  status?: string;
  location?: string;
}

interface EditListingDialogProps {
  listing: CarListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedListing: Partial<CarListing>) => void;
}

export function EditListingDialog({
  listing,
  isOpen,
  onClose,
  onSave,
}: EditListingDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    carName: "",
    price: 0,
    servicedDate: "",
    status: RENTAL_STATUS.PENDING,
    location: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = useCallback(() => {
    setFormData({
      carName: "",
      price: 0,
      servicedDate: "",
      status: RENTAL_STATUS.PENDING,
      location: "",
    });
    setErrors({});
  }, []);

  const populateForm = useCallback((listing: CarListing) => {
    setFormData({
      carName: listing.carName || "",
      price: listing.price || 0,
      servicedDate: listing.servicedDate || "",
      status: listing.status || "pending",
      location: listing.location || "",
    });
    setErrors({});
  }, []);

  useEffect(() => {
    if (listing) {
      populateForm(listing);
    } else {
      resetForm();
    }
  }, [listing]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.carName.trim()) newErrors.carName = "Car name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.servicedDate.trim())
      newErrors.servicedDate = "Serviced date is required";
    if (
      !formData.status ||
      !["pending", "approved", "rejected"].includes(formData.status)
    )
      newErrors.status = "Valid status is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error("Error updating listing:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [listing, validateForm, onSave, onClose],
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Car Listing</DialogTitle>
          <DialogDescription>
            Update the details for this car rental listing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="carName">Car Name</Label>
            <Input
              id="carName"
              value={formData.carName}
              onChange={(e) => handleInputChange("carName", e.target.value)}
              placeholder="Car name"
            />
            {errors.carName && (
              <p className="text-sm text-red-600">{errors.carName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price per Day ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="servicedDate">Serviced Date</Label>
              <Input
                id="servicedDate"
                type="date"
                value={getInputFieldDateValue(formData.servicedDate)}
                onChange={(e) =>
                  handleInputChange("servicedDate", e.target.value)
                }
              />
              {errors.servicedDate && (
                <p className="text-sm text-red-600">{errors.servicedDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as "pending" | "approved" | "rejected",
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
              />
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getInputFieldDateValue(str: string) {
  try {
    const date = new Date(str);
    return date.toISOString().split("T")[0];
  } catch (error) {
    return "";
  }
}
