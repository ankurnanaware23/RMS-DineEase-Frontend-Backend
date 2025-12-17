import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table } from '@/types';

interface AddTableFormProps {
  onAddTable: (table: Omit<Table, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddTableForm({ onAddTable }: AddTableFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    seats: '',
    status: 'Available' as Table['status'],
    customer: '',
    reservationTime: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.seats) {
      return;
    }

    const tableData: Omit<Table, 'id' | 'createdAt' | 'updatedAt'> = {
      number: parseInt(formData.number),
      seats: parseInt(formData.seats),
      status: formData.status,
      customer: formData.customer || undefined,
      reservationTime: formData.reservationTime || undefined,
    };

    onAddTable(tableData);
    setOpen(false);
    setFormData({
      number: '',
      seats: '',
      status: 'Available',
      customer: '',
      reservationTime: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border">
          Add Table ⬇
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number" className="text-foreground">Table Number</Label>
            <Input
              id="number"
              type="number"
              placeholder="Enter table number"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              className="bg-card border-border text-foreground"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seats" className="text-foreground">Number of Seats</Label>
            <Input
              id="seats"
              type="number"
              placeholder="Enter number of seats"
              value={formData.seats}
              onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
              className="bg-card border-border text-foreground"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">Status</Label>
            <Select value={formData.status} onValueChange={(value: Table['status']) => 
              setFormData(prev => ({ ...prev, status: value }))
            }>
              <SelectTrigger className="bg-card border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Occupied">Occupied</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.status === 'Booked' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-foreground">Customer Name</Label>
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  value={formData.customer}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                  className="bg-card border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reservationTime" className="text-foreground">Reservation Time</Label>
                <Input
                  id="reservationTime"
                  type="time"
                  value={formData.reservationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, reservationTime: e.target.value }))}
                  className="bg-card border-border text-foreground"
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-restaurant-blue hover:bg-restaurant-blue/90">
              Add Table
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}