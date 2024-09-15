function removeId(array) {
  const arrayWithoutId = array.map(({ id, ...rest }) => rest);
  return arrayWithoutId;
}

export async function addWhiteboard({ elements, currentName: name }) {
  const newElements = removeId(elements);
  try {
    const response = await fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shapes: newElements, name }),
    });

    if (!response.ok) {
      throw new Error(`Whiteboard could not be created: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in addWhiteboard:", error);
  }
}

export async function updateWhiteboard(id, elements, name) {
  const response = await fetch(`http://localhost:8080/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shapes: elements, name }),
  });

  if (!response.ok) {
    throw new Error(`Whiteboard could not be updated: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function getWhiteboard() {
  const response = await fetch("http://localhost:8080/");
  const data = await response.json();
  return data;
}

export async function getWhiteboardById(id) {
  const response = await fetch(`http://localhost:8080/${id}`);
  const data = await response.json();
  return data;
}

export async function deleteWhiteboard(id) {
  const res = await fetch(`http://localhost:8080/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Whiteboard could not be deleted:`);
  }
  const data = await res.json();
  return data;
}
