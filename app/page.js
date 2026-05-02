import AuraBoard from '../components/AuraBoard';

export default function Home() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AuraBoard />
    </div>
  );
}
