import React from "react";
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Save, X } from "lucide-react";

// Schema for basic author data editing
const basicAuthorSchema = z
  .object({
    authorType: z.enum(["person", "organization"], {
      errorMap: () => ({ message: "Bitte wähle eine Art des Urhebers aus" }),
    }),
    isPseudonym: z.boolean().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    birthDate: z.date().optional().nullable(),
    deathDate: z.date().optional().nullable(),
    isni: z.string().optional(),
    profession: z.string().optional(),
    company: z.string().optional(),
    website: z.string().optional(),
    companyName: z.string().optional(),
    additionalInfo: z.string().optional(),
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
        "Bitte gib entweder einen Nachnamen (für Personen) oder den Namen der Körperschaft ein",
      path: ["lastName", "companyName"],
    },
  );

export type BasicAuthorFormValues = z.infer<typeof basicAuthorSchema>;

export type Author = {
  id: string;
  authorType: "person" | "organization";
  firstName?: string;
  lastName?: string;
  companyName?: string;
  isPseudonym?: boolean;
  isni?: string;
  profession?: string;
  company?: string;
  website?: string;
  birthDate?: Date | null;
  deathDate?: Date | null;
};

interface AuthorBasicDataFormProps {
  author: Author;
  onSave: (data: BasicAuthorFormValues) => void;
  onCancel: () => void;
  showButtons?: boolean;
}

const AuthorBasicDataForm: React.FC<AuthorBasicDataFormProps> = ({
  author,
  onSave,
  onCancel,
  showButtons = true,
}) => {
  const form = useForm<BasicAuthorFormValues>({
    resolver: zodResolver(basicAuthorSchema),
    defaultValues: {
      authorType: author.authorType,
      firstName: author.firstName || "",
      lastName: author.lastName || "",
      companyName: author.companyName || "",
      isPseudonym: author.isPseudonym || false,
      birthDate: author.birthDate,
      deathDate: author.deathDate,
      isni: author.isni || "",
      profession: author.profession || "",
      company: author.company || "",
      website: author.website || "",
      additionalInfo: "",
    },
  });

  const authorType = form.watch("authorType");

  return (
    <Form {...form}>
      <form
        id="author-form"
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="authorType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-gray-900">
                Art des Urhebers
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="person" />
                    </FormControl>
                    <FormLabel className="font-normal text-gray-900">
                      Person
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="organization" />
                    </FormControl>
                    <FormLabel className="font-normal text-gray-900">
                      Körperschaft
                    </FormLabel>
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
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Vorname
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Vorname"
                          maxLength={120}
                          {...field}
                          className={cn(
                            "pr-16",
                            fieldState.error &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500",
                          )}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                          {field.value?.length || 0}/120
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Nachname*
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Nachname"
                          maxLength={120}
                          {...field}
                          className={cn(
                            "pr-16",
                            fieldState.error &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500",
                          )}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                          {field.value?.length || 0}/120
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600" />
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
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Geburtsdatum
                    </FormLabel>
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
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deathDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Sterbedatum
                    </FormLabel>
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
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="profession"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Beruf
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Beruf"
                        maxLength={120}
                        {...field}
                        className={cn(
                          "pr-16",
                          fieldState.error &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500",
                        )}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/120
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </>
        )}

        {authorType === "organization" && (
          <>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Name der Körperschaft*
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Name der Körperschaft"
                        maxLength={200}
                        {...field}
                        className={cn(
                          "pr-16",
                          fieldState.error &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500",
                        )}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/200
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">
                    Weiterführende Informationen
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Weiterführende Informationen zur Körperschaft"
                      className={cn(
                        "resize-none",
                        fieldState.error &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isni"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  ISNI
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ISNI"
                    {...field}
                    className={cn(
                      fieldState.error &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500",
                    )}
                  />
                </FormControl>
                <FormDescription>
                  International Standard Name Identifier
                </FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Website
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://..."
                    {...field}
                    className={cn(
                      fieldState.error &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500",
                    )}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>

        {showButtons && (
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default AuthorBasicDataForm;
