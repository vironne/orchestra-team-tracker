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
import { updateClient } from "@/app/actions/clients";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

type Contact = { name: string; email: string; phone: string; role: string };

type ClientData = {
  id: string;
  name: string;
  company: string | null;
  contacts: unknown;
  notes: string | null;
};

export function EditClientDialog({ client }: { client: ClientData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialContacts: Contact[] = Array.isArray(client.contacts)
    ? (client.contacts as Contact[])
    : [{ name: "", email: "", phone: "", role: "" }];

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

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
    const validContacts = contacts.filter((c) => c.name.trim() !== "");

    try {
      const result = await updateClient(client.id, {
        name: form.get("name") as string,
        company: (form.get("company") as string) || null,
        email: validContacts[0]?.email || null,
        phone: validContacts[0]?.phone || null,
        contacts: validContacts,
        notes: (form.get("notes") as string) || null,
      });
      if (result && typeof result === "object" && "success" in result && !result.success) {
        toast.error("Erreur lors de la mise à jour");
        return;
      }
      toast.success("Entreprise mise à jour");
      setOpen(false);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  // Reset contacts when dialog opens
  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      setContacts(
        Array.isArray(client.contacts)
          ? (client.contacts as Contact[])
          : [{ name: "", email: "", phone: "", role: "" }]
      );
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;entreprise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nom de l&apos;entreprise *</Label>
            <Input name="name" required defaultValue={client.name} className="text-base font-medium" />
          </div>

          <div className="space-y-2">
            <Label>Raison sociale</Label>
            <Input name="company" defaultValue={client.company ?? ""} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Contacts</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addContact} className="h-7 text-xs text-violet-400 hover:text-violet-300">
                <UserPlus className="mr-1 h-3.5 w-3.5" />
                Ajouter un contact
              </Button>
            </div>

            {contacts.map((contact, index) => (
              <div key={index} className="rounded-lg border border-zinc-800 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">Contact {index + 1}</span>
                  {contacts.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-red-400" onClick={() => removeContact(index)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Nom" value={contact.name} onChange={(e) => updateContact(index, "name", e.target.value)} />
                  <Input placeholder="Rôle" value={contact.role} onChange={(e) => updateContact(index, "role", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="email" placeholder="Email" value={contact.email} onChange={(e) => updateContact(index, "email", e.target.value)} />
                  <Input placeholder="Téléphone" value={contact.phone} onChange={(e) => updateContact(index, "phone", e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea name="notes" rows={2} defaultValue={client.notes ?? ""} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading}>{loading ? "Enregistrement…" : "Enregistrer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
