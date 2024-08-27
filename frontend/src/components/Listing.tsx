import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {MoreHorizontal} from "lucide-react";
import {revalidateTag} from "next/cache";
import {AddDialog} from "./AddDialog";
import {DeleteDialog} from "./DeleteDialog";
import {EditDialog} from "./EditDialog";

const getUsers = async () => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
      next: { tags: ["users"] },
    });
    const users = await response.json();
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};
const editUser = async (user: any) => {
  "use server";
  try {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_API_URL + "/users/" + user.id,
      user
    );
    revalidateTag('users')
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (userId: number) => {
  "use server";
  try {
    await axios.delete(process.env.NEXT_PUBLIC_API_URL + "/users/" + userId);
    revalidateTag('users')
  } catch (error) {
    console.error(error);
  }
};

const addUser = async (user: any) => {
  "use server";
  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/users", user);
    revalidateTag('users')
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export async function Dashboard() {
  // Fetch the users using the `use` hook
  const users = await getUsers();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Card className="px-20 py-8" x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-4">
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage your users and view their description.
            </CardDescription>
          </div>
          <AddDialog addUser={addUser} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <EditDialog user={user} editUser={editUser} />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DeleteDialog user={user} deleteUser={deleteUser} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
