import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const createAuthorSchema = (isEmbedded: boolean = false) =>
  z
    .object({
      authorType: z.enum(["person", "organization"]),
      isPseudonym: z.boolean().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      birthDate: z.date().optional().nullable(),
      deathDate: z.date().optional().nullable(),
      isni: z.string().optional(),
      biographies: z
        .array(
          z.object({
            text: z
              .string()
              .min(1, { message: "Biografie-Text ist erforderlich" }),
            label: z
              .string()
              .min(1, { message: "Bezeichnung ist erforderlich" }),
            language: z
              .string()
              .min(1, { message: "Sprache ist erforderlich" }),
          }),
        )
        .default([])
        .refine(
          (biographies) => {
            if (isEmbedded) return true; // Optional for embedded forms
            return biographies.length >= 1;
          },
          {
            message: "Mindestens eine Biografie ist erforderlich",
          },
        ),
      companyName: z.string().optional(),
      additionalInfo: z.string().optional(),
      profession: z.string().optional(),
      company: z.string().optional(),
      website: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.authorType === "person") {
          return !!data.lastName;
        } else if (data.authorType === "organization") {
          return !!data.companyName;
        }
        return true;
      },
      {
        message:
          "Entweder Nachname (für Personen) oder Firmenname (für Körperschaften) muss angegeben werden",
        path: ["lastName", "companyName"],
      },
    );

const authorSchema = createAuthorSchema();

type AuthorFormValues = z.infer<typeof authorSchema>;

interface AuthorFormProps {
  onSubmit: (data: AuthorFormValues) => void;
  initialData?: AuthorFormValues;
  onCancel?: () => void;
  isEmbedded?: boolean;
  showSubmitButton?: boolean;
}

const defaultValues: Partial<AuthorFormValues> = {
  authorType: "person",
  isPseudonym: false,
  biographies: [{ text: "", label: "", language: "Deutsch" }],
  birthDate: null,
  deathDate: null,
};

const languageOptions = [
  { value: "Deutsch", label: "Deutsch" },
  { value: "English", label: "Englisch" },
  { value: "Français", label: "Französisch" },
  { value: "Español", label: "Spanisch" },
  { value: "Italiano", label: "Italienisch" },
  { value: "Nederlands", label: "Niederländisch" },
  { value: "Polski", label: "Polnisch" },
  { value: "Português", label: "Portugiesisch" },
  { value: "Русский", label: "Russisch" },
  { value: "中文", label: "Chinesisch" },
  { value: "日本語", label: "Japanisch" },
];

export function AuthorForm({
  onSubmit,
  initialData,
  onCancel,
  isEmbedded = false,
  showSubmitButton = true,
}: AuthorFormProps) {
  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(createAuthorSchema(isEmbedded)),
    defaultValues:
      initialData ||
      (isEmbedded ? { ...defaultValues, biographies: [] } : defaultValues),
  });

  const authorType = form.watch("authorType");

  const handleAddBiography = () => {
    const currentBiographies = form.getValues("biographies") || [];
    form.setValue("biographies", [
      ...currentBiographies,
      { text: "", label: "", language: "Deutsch" },
    ]);
  };

  const handleRemoveBiography = (index: number) => {
    const currentBiographies = form.getValues("biographies") || [];
    if (currentBiographies.length > 1) {
      form.setValue(
        "biographies",
        currentBiographies.filter((_, i) => i !== index),
      );
    }
  };

  return (
    <Form {...form}>
      <form
        id="author-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="authorType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Art des Urhebers</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid gap-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="person" />
                    </FormControl>
                    <FormLabel className="font-normal">Person</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="organization" />
                    </FormControl>
                    <FormLabel className="font-normal">Körperschaft</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {authorType === "person" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorname</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Vorname"
                          maxLength={120}
                          {...field}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                          {field.value?.length || 0}/120
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nachname*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Nachname"
                          maxLength={120}
                          {...field}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                          {field.value?.length || 0}/120
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPseudonym"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Pseudonym</FormLabel>
                    <FormDescription>
                      Handelt es sich bei diesem Namen um ein Pseudonym?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Geburtsdatum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Datum auswählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() ||
                            (form.getValues("deathDate") &&
                              date > form.getValues("deathDate")!)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deathDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Sterbedatum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Datum auswählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() ||
                            (form.getValues("birthDate") &&
                              date < form.getValues("birthDate")!)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beruf</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Beruf"
                        maxLength={120}
                        {...field}
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/120
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {authorType === "organization" && (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name der Körperschaft*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Name der Körperschaft"
                      maxLength={200}
                      {...field}
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                      {field.value?.length || 0}/200
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISNI</FormLabel>
                <FormControl>
                  <Input placeholder="ISNI" {...field} />
                </FormControl>
                <FormDescription>
                  International Standard Name Identifier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {authorType === "organization" && (
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weiterführende Informationen*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Weiterführende Informationen zur Körperschaft"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {authorType === "person" && (
          <div className="border p-4 rounded-md bg-slate-50">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">
                Biografische Angaben{isEmbedded ? "" : "*"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Pro Buch wird eine eigene Vita empfohlen.
              </p>
            </div>

            {form.getValues("biographies")?.map((_, index) => (
              <div
                key={index}
                className="mb-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Vita {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBiography(index)}
                    disabled={form.getValues("biographies")?.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <FormField
                    control={form.control}
                    name={`biographies.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bezeichnung*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="z.B. Kurzvita, Langvita, Für Kinderbuch"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`biographies.${index}.language`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sprache*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sprache auswählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languageOptions.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`biographies.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Biografische Angaben"
                            className="resize-none pr-16"
                            maxLength={3000}
                            {...field}
                          />
                          <span className="absolute right-3 top-3 text-xs text-muted-foreground">
                            {field.value?.length || 0}/3000
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBiography}
              >
                <Plus className="h-4 w-4 mr-2" />
                Weitere Vita hinzufügen
              </Button>
            </div>
          </div>
        )}

        {showSubmitButton && (
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Abbrechen
              </Button>
            )}
            <Button type="submit">Speichern</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
