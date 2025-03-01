import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Drink {
    id: string;
    name: string;
}

interface DeleteDrinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    drinkToDelete: Drink | null;
    handleDeleteConfirm: () => Promise<void>;
}

const DeleteDrinkDialog: React.FC<DeleteDrinkDialogProps> = ({ open, onOpenChange, drinkToDelete, handleDeleteConfirm }) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete{' '}
                        <span className="font-semibold">{drinkToDelete?.name}</span>{' '}
                        from the menu.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDrinkDialog;