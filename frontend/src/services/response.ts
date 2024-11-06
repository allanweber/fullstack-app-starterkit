export const responseOrError = async (response: any) => {
  if (response.ok) return await response.json();
  else {
    const errors = await readErrors(response);
    throw new Error(errors);
  }
};

export async function readErrors(rawResponse: any) {
  const response = await rawResponse.json();

  if (rawResponse.status === 401) {
    throw new Error(response.message);
  }

  if (response.error) {
    return response.error;
  } else if (response.message) {
    return response.message;
  } else if (response.errors) {
    const message = response.errors.join('\n');
    return message;
  }
}
