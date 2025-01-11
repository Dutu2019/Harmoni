export async function postAPI(url: string, data: any) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    const jsoned = await res.json();
  return {status: res.status, data: jsoned};
}

