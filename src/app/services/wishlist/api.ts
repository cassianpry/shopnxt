export const getWishList = async (id: string | undefined) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${id}`
  );
  return await response.json();
};

export const createWishList = async ({
  user,
  product,
}: {
  user: string;
  product: string;
}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
    method: "POST",
    body: JSON.stringify({ user, product }),
    headers: { "Content-Type": "application/json" },
  });
  const res = await response.json();
  if (!response.ok) {
    return await response.json().then((error) => {
      console.log(error);
    });
  } else if (res.Error === "Usuário não encontrado") {
    console.log(res.Error);
    window.location.href = "/sign-in";
  } else {
  }
};

export const deleteProductWishList = async ({
  user,
  product,
}: {
  user: string;
  product: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${user}`,
    {
      method: "DELETE",
      body: JSON.stringify({ product }),
      headers: { "Content-Type": "application/json" },
    }
  );
  const res = await response.json();
  if (!response.ok) {
    const error = res;
    throw new Error(error);
  } else if (res.Error === "Usuário não encontrado") {
    console.log(res.Error);
  } else {
    return res;
  }
};
