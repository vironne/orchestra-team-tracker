"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/app/actions/clients";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

type Contact = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

export function ClientFormDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([
    { name: "", email: "", phone: "", role: "" },
  ]);

  function addContact() {
    setContacts((prev) => [...prev, { name: "", email: "", phone: "", role: "" }]);
  }

  function removeContact(index: number) {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  }

  function updateContact(index: number, field: keyof Contact, value: string) {
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    // Filter out empty contacts
    const validContacts = contacts.filter((c) => c.name.trim() !== "");

    try {
      const result = await createClient({
        name: form.get("name") as string,
        email: validContacts[0]?.email || null,
        phone: validContacts[0]?.phone || null,
        company: (form.get("company") as string) || null,
        contacts: validContacts,
        notes: (form.get("notes") as string) || null,
      });
      if (!result.success) {
        toast.error(result.error || "Erreur lors de la création");
        return;
      }
      toast.success("Entreprise créée");
      setOpen(false);
      setContacts([{ name: "", email: "", phone: "", role: "" }]);
    } catch (err) {
      console.error("[ClientForm] Error:", err);
      toast.error("Erreur réseau lors de la création");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Nouvelle entreprise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle entreprise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom entreprise - champ principal */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l&apos;entreprise *</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Acme Corp"
              className="text-base font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Raison sociale</Label>
            <Input
              id="company"
              name="company"
              placeholder="Raison sociale (si différente)"
            />
          </div>

          {/* Contacts multiples */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Contacts</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addContact}
                className="h-7 text-xs text-violet-400 hover:text-violet-300"
              >
                <UserPlus className="mr-1 h-3.5 w-3.5" />
                Ajouter un contact
              </Button>
            </div>

            {contacts.map((contact, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-800 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">
                    Contact {index + 1}
                  </span>
                  {contacts.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-500 hover:text-red-400"
                      onClick={() => removeContact(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Nom du contact"
                    value={contact.name}
                    onChange={(e) =>
                      updateContact(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Rôle (ex: DG, CTO…)"
                    value={contact.role}
                    onChange={(e) =>
                      updateContact(index, "role", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="email"
                    placeholder="email@exemple.com"
                    value={contact.email}
                    onChange={(e) =>
                      updateContact(index, "email", e.target.value)
                    }
                  />
                  <Input
                    placeholder="+33 6 12 34 56 78"
                    value={contact.phone}
                    onChange={(e) =>
                      updateContact(index, "phone", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Informations complémentaires…"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création…" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
