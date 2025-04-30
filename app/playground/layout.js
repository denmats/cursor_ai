import AppLayout from '../components/AppLayout'; // Import the shared component

export default function PlaygroundLayout({ children }) {
  // Simply render the shared layout, passing the children through
  return <AppLayout>{children}</AppLayout>;
} 