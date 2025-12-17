import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table } from '@/types';

interface BookTableFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTable: (tableId: string, customerName: string) => void;
  tables: Table[];
}

export function BookTableForm({ isOpen, onClose, onBookTable, tables }: BookTableFormProps) {
  const [tableId, setTableId] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableId && customerName) {
      onBookTable(tableId, customerName);
      onClose();
      setTableId('');
      setCustomerName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Select onValuecha-ge={setTableId} value={tableId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    Table {table.number} ({table.seats} seats)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              placeholder="Customer Name" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
            />
          </div>
          <DialogFooter>
            <Button type="submit">Book Table</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}