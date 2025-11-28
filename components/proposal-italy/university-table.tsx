"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { UniversityProposal } from "@/lib/proposal-italy-types"

interface UniversityTableProps {
  proposals: UniversityProposal[]
  onChange: (proposals: UniversityProposal[]) => void
}

const emptyProposal: Omit<UniversityProposal, "id"> = {
  universityName: "",
  courseName: "",
  courseLink: "",
  applicationFees: 0,
  notes: "",
}

export function UniversityTable({ proposals, onChange }: UniversityTableProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<UniversityProposal, "id">>(emptyProposal)

  const handleOpen = (proposal?: UniversityProposal) => {
    if (proposal) {
      setEditingId(proposal.id)
      setFormData({
        universityName: proposal.universityName,
        courseName: proposal.courseName,
        courseLink: proposal.courseLink,
        applicationFees: proposal.applicationFees,
        notes: proposal.notes,
      })
    } else {
      setEditingId(null)
      setFormData(emptyProposal)
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (editingId) {
      onChange(proposals.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p)))
    } else {
      onChange([...proposals, { ...formData, id: crypto.randomUUID() }])
    }
    setIsOpen(false)
    setFormData(emptyProposal)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    onChange(proposals.filter((p) => p.id !== id))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR" }).format(amount)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[rgb(41,84,144)]">5. University Proposals</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add University
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit University" : "Add University"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="universityName">University Name *</Label>
                <Input
                  id="universityName"
                  value={formData.universityName}
                  onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                  placeholder="e.g., Politecnico di Milano"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder="e.g., Computer Science and Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseLink">Course Link</Label>
                <Input
                  id="courseLink"
                  type="url"
                  value={formData.courseLink}
                  onChange={(e) => setFormData({ ...formData, courseLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicationFees">Application Fees (EUR)</Label>
                <Input
                  id="applicationFees"
                  type="number"
                  value={formData.applicationFees || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, applicationFees: Number.parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.universityName || !formData.courseName}
                className="bg-[rgb(41,84,144)] hover:bg-[rgb(41,84,144)]/90"
              >
                {editingId ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {proposals.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="w-[80px]">Link</TableHead>
                <TableHead className="w-[150px]">Notes</TableHead>
                <TableHead className="text-right">App. Fees</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal, index) => (
                <TableRow key={proposal.id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{proposal.universityName}</TableCell>
                  <TableCell>{proposal.courseName}</TableCell>
                  <TableCell>
                    {proposal.courseLink ? (
                      <a
                        href={proposal.courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[rgb(41,84,144)] underline hover:no-underline"
                      >
                        🔗
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{proposal.notes || "-"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(proposal.applicationFees)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpen(proposal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(proposal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-border py-12 text-center">
          <p className="text-muted-foreground">No universities added yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">Click "Add University" to get started.</p>
        </div>
      )}
    </div>
  )
}
