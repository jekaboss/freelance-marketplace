"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Check, Search } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectorDialogProps {
  selectedCategories: number[];
  onChange: (categoryIds: number[]) => void;
}

// Sample categories - in production, fetch from API
const defaultCategories: Category[] = [
  { id: 1, name: "Web Development" },
  { id: 2, name: "Mobile Development" },
  { id: 3, name: "UI/UX Design" },
  { id: 4, name: "Graphic Design" },
  { id: 5, name: "Writing & Translation" },
  { id: 6, name: "Video & Animation" },
  { id: 7, name: "Music & Audio" },
  { id: 8, name: "Programming & Tech" },
  { id: 9, name: "Business Consulting" },
  { id: 10, name: "Digital Marketing" },
  { id: 11, name: "Data Science" },
  { id: 12, name: "Photography" },
];

export function CategorySelectorDialog({
  selectedCategories,
  onChange,
}: CategorySelectorDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelected, setTempSelected] = useState<number[]>(selectedCategories);

  const filteredCategories = defaultCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (categoryId: number) => {
    setTempSelected((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = () => {
    onChange(tempSelected);
    setOpen(false);
  };

  const handleClear = () => {
    setTempSelected([]);
  };

  const selectedNames = defaultCategories
    .filter((cat) => selectedCategories.includes(cat.id))
    .map((cat) => cat.name);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-left font-normal h-auto py-2 min-h-[40px]"
        >
          {selectedCategories.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedNames.map((name, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">{t("selectCategories")}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("selectCategoriesTitle")}</DialogTitle>
          <DialogDescription>
            {t("selectedCategories")} {tempSelected.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchCategories")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {filteredCategories.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {t("noCategoriesFound")}
              </p>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  {tempSelected.includes(category.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))
            )}
          </div>

          {tempSelected.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {tempSelected.map((categoryId) => {
                const category = defaultCategories.find(
                  (cat) => cat.id === categoryId
                );
                if (!category) return null;
                return (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category.name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.id);
                      }}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {tempSelected.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="text-destructive hover:text-destructive"
            >
              {t("clear")}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
