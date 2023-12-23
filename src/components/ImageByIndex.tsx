export const images: string[] = [
  'https://images.unsplash.com/photo-1682686580003-22d3d65399a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1699730148440-22fc68a96752?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1682686580003-22d3d65399a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1682686580003-22d3d65399a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D',
];

const imageByIndex = (index: number): string => images[index % images.length];

export default imageByIndex;
