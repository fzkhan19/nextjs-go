import {revalidateTag} from "next/cache";

const SERVER_URL = process.env.NEXT_API_URL;
const PREFIX = "/api/go";

const API_URL = SERVER_URL + PREFIX;

console.log("API URL::::",API_URL)

const getUsers = async () => {
  try {
    const response = await fetch(API_URL + "/users", {
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
    const response = await fetch(API_URL + "/users/" + user.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    revalidateTag('users')
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (userId: number) => {
  "use server";
  try {
    await fetch(API_URL + "/users/" + userId, {
      method: 'DELETE',
    });
    revalidateTag('users')
  } catch (error) {
    console.error(error);
  }
};

const addUser = async (user: any) => {
  "use server";
  try {
    const response = await fetch(API_URL + "/users", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    revalidateTag('users')
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

export {addUser, deleteUser, editUser, getUsers};

