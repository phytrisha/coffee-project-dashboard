import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CoffeeTableHeader() {
  return (
    <div className="w-full flex flex-row items-center">
        <h1 className="w-full text-xl font-bold">
          Coffee Shops
        </h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Add Coffee Shop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Coffee Shop</DialogTitle>
              <DialogDescription>
                Add a new coffee shop.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="name" id="name" placeholder="My Coffee Shop" />
              </div>
              <div className="grid w-full gap-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea placeholder="Type your message here." id="description" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Coffee Shop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}
