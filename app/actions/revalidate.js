// app/actions/revalidate.js
'use server';

import { revalidatePath } from 'next/cache';

export async function clearCache() {
  revalidatePath('/', 'layout');
}

export async function revalidateBlog() {
  revalidatePath('/blog', 'layout');
  revalidatePath('/', 'layout');
}