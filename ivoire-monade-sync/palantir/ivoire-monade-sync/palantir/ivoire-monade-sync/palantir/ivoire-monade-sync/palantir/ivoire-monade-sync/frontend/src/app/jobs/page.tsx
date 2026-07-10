import fs from 'fs';
import path from 'path';

const jobsPath = path.join(process.cwd(), '..', 'inbox', 'remote-jobs.json');
const data = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));

export default function JobsPage() {
  return (
    <main style={{maxWidth: 960, margin: '0 auto', padding: 24}}>
      <h1>Remote Opportunities</h1>
      <p style={{color: '#666'}}>Auto-seeded from /inbox/remote-jobs.json</p>

      <section style={{marginTop: 24}}>
        <h2>Opportunities</h2>
        <ul>
          {data.opportunities.map((job: any) => (
            <li key={job.name} style={{marginBottom: 12}}>
              <strong>{job.name}</strong> — status: {job.status}
              <div>
                <a href={job.apply_url} target="_blank" rel="noreferrer">{job.apply_url}</a>
              </div>
              {job.payload && (
                <div style={{fontSize: 12, color: '#555'}}>Payload: {job.payload}</div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section style={{marginTop: 32}}>
        <h2>LinkedIn Drafts</h2>
        <pre style={{background: '#f6f8fa', padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap'}}>
{data.linkedin_drafts.headline}

{data.linkedin_drafts.about}

Post:
{data.linkedin_drafts.post_remote_search}
        </pre>
      </section>

      <footer style={{marginTop: 40, fontSize: 12, color: '#999'}}>
        Updated: {data.updated_at}
      </footer>
    </main>
  );
}
