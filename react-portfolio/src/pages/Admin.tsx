import { useState, useEffect } from 'react';
import { PageTransition } from '../components/PageTransition';
import { supabase, type Profile, type Project, type BlogPost } from '../lib/supabase';

type Tab = 'profiles' | 'projects' | 'blog';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Profile | Project | BlogPost | null>(null);

  const handleLogin = () => {
    if (password === 'theryx2026') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [profilesRes, projectsRes, blogRes] = await Promise.all([
        supabase.from('profiles').select('*').order('id'),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('blog_posts').select('*').order('sort_order', { ascending: true }),
      ]);
      if (profilesRes.data) setProfiles(profilesRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (blogRes.data) setBlogPosts(blogRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll();
    }
  }, [isAuthenticated]);

  const saveProfile = async (profile: Partial<Profile>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ ...profile, updated_at: new Date().toISOString() })
        .select();
      if (error) throw error;
      await fetchAll();
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const saveProject = async (project: Partial<Project>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .upsert({ ...project, updated_at: new Date().toISOString() })
        .select();
      if (error) throw error;
      await fetchAll();
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const saveBlogPost = async (post: Partial<BlogPost>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .upsert({ ...post, updated_at: new Date().toISOString() })
        .select();
      if (error) throw error;
      await fetchAll();
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving blog post:', err);
      alert('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const toggleHidden = async (table: 'projects' | 'blog_posts', item: Project | BlogPost) => {
    const newHidden = !item.is_hidden;
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_hidden: newHidden })
        .eq('id', item.id);
      if (error) throw error;
      await fetchAll();
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const deleteItem = async (table: 'projects' | 'blog_posts' | 'profiles', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await fetchAll();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <section className="admin-login">
          <div className="container">
            <div className="admin-login__form">
              <h2>Admin Login</h2>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button onClick={handleLogin} className="btn btn--primary">Login</button>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="admin">
        <div className="container">
          <h2 className="section__title">Admin Dashboard</h2>
          
          <div className="admin__tabs">
            <button
              className={`admin__tab ${activeTab === 'profiles' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('profiles')}
            >
              Profiles ({profiles.length})
            </button>
            <button
              className={`admin__tab ${activeTab === 'projects' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects ({projects.length})
            </button>
            <button
              className={`admin__tab ${activeTab === 'blog' ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab('blog')}
            >
              Blog Posts ({blogPosts.length})
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {activeTab === 'profiles' && (
                <div className="admin__section">
                  <div className="admin__header">
                    <h3>Portfolio Profiles</h3>
                    <button
                      className="btn btn--primary"
                      onClick={() => setEditingItem({} as Profile)}
                    >
                      + New Profile
                    </button>
                  </div>
                  <div className="admin__list">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="admin__item">
                        <div className="admin__item-info">
                          <strong>{profile.name}</strong>
                          <span>ID: {profile.id}</span>
                          <span className={`admin__status ${profile.is_active ? 'admin__status--active' : ''}`}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="admin__item-actions">
                          <button onClick={() => setEditingItem(profile)}>Edit</button>
                          <button onClick={() => deleteItem('profiles', profile.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="admin__section">
                  <div className="admin__header">
                    <h3>Projects</h3>
                    <button
                      className="btn btn--primary"
                      onClick={() => setEditingItem({ profile_id: 'default' } as Project)}
                    >
                      + New Project
                    </button>
                  </div>
                  <div className="admin__list">
                    {projects.map((project) => (
                      <div key={project.id} className="admin__item">
                        <div className="admin__item-info">
                          <strong>{project.title}</strong>
                          <span>Profile: {project.profile_id}</span>
                          <span className={`admin__status ${project.is_hidden ? 'admin__status--hidden' : 'admin__status--visible'}`}>
                            {project.is_hidden ? 'Hidden' : 'Visible'}
                          </span>
                        </div>
                        <div className="admin__item-actions">
                          <button onClick={() => toggleHidden('projects', project)}>
                            {project.is_hidden ? 'Show' : 'Hide'}
                          </button>
                          <button onClick={() => setEditingItem(project)}>Edit</button>
                          <button onClick={() => deleteItem('projects', project.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="admin__section">
                  <div className="admin__header">
                    <h3>Blog Posts</h3>
                    <button
                      className="btn btn--primary"
                      onClick={() => setEditingItem({ profile_id: 'default' } as BlogPost)}
                    >
                      + New Post
                    </button>
                  </div>
                  <div className="admin__list">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="admin__item">
                        <div className="admin__item-info">
                          <strong>{post.title}</strong>
                          <span>Profile: {post.profile_id}</span>
                          <span className={`admin__status ${post.is_hidden ? 'admin__status--hidden' : 'admin__status--visible'}`}>
                            {post.is_hidden ? 'Hidden' : 'Visible'}
                          </span>
                        </div>
                        <div className="admin__item-actions">
                          <button onClick={() => toggleHidden('blog_posts', post)}>
                            {post.is_hidden ? 'Show' : 'Hide'}
                          </button>
                          <button onClick={() => setEditingItem(post)}>Edit</button>
                          <button onClick={() => deleteItem('blog_posts', post.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {editingItem && (
            <div className="admin__modal">
              <div className="admin__modal-content">
                <h3>
                  {editingItem && 'id' in editingItem && editingItem.id ? 'Edit' : 'Create'}{' '}
                  {activeTab === 'profiles' ? 'Profile' : activeTab === 'projects' ? 'Project' : 'Blog Post'}
                </h3>
                
                {activeTab === 'profiles' ? (
                  <ProfileForm
                    profile={editingItem as Profile}
                    onSave={saveProfile}
                    onCancel={() => setEditingItem(null)}
                    saving={saving}
                  />
                ) : activeTab === 'projects' ? (
                  <ProjectForm
                    project={editingItem as Project}
                    profiles={profiles}
                    onSave={saveProject}
                    onCancel={() => setEditingItem(null)}
                    saving={saving}
                  />
                ) : (
                  <BlogForm
                    post={editingItem as BlogPost}
                    profiles={profiles}
                    onSave={saveBlogPost}
                    onCancel={() => setEditingItem(null)}
                    saving={saving}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

function ProfileForm({ profile, onSave, onCancel, saving }: {
  profile: Profile | null;
  onSave: (p: Partial<Profile>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: profile?.id || '',
    name: profile?.name || '',
    is_active: profile?.is_active ?? true,
    bio: profile?.bio || '',
    tagline: profile?.tagline || '',
    hero_title: profile?.hero_title || '',
    hero_subtitle: profile?.hero_subtitle || '',
    philosophy_title: profile?.philosophy_title || '',
    philosophy_text: profile?.philosophy_text || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin__field">
        <label>Profile ID (slug)</label>
        <input
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          placeholder="e.g., fintech, design-engineer"
          required
        />
      </div>
      <div className="admin__field">
        <label>Display Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="admin__field">
        <label>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Active
        </label>
      </div>
      <div className="admin__field">
        <label>Bio (short)</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Tagline</label>
        <textarea
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Hero Title</label>
        <input
          value={form.hero_title}
          onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Hero Subtitle</label>
        <textarea
          value={form.hero_subtitle}
          onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Philosophy Title</label>
        <input
          value={form.philosophy_title}
          onChange={(e) => setForm({ ...form, philosophy_title: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Philosophy Text</label>
        <textarea
          value={form.philosophy_text}
          onChange={(e) => setForm({ ...form, philosophy_text: e.target.value })}
        />
      </div>
      <div className="admin__actions">
        <button type="submit" disabled={saving} className="btn btn--primary">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn--secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProjectForm({ project, profiles, onSave, onCancel, saving }: {
  project: Project | null;
  profiles: Profile[];
  onSave: (p: Partial<Project>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: project?.id || '',
    profile_id: project?.profile_id || 'default',
    tag: project?.tag || '',
    title: project?.title || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    impact: project?.impact || '',
    site: project?.site || '',
    role: project?.role || '',
    period: project?.period || '',
    location: project?.location || '',
    challenge: project?.challenge || '',
    challenge_text: project?.challenge_text || '',
    solution: project?.solution || '',
    solution_text: project?.solution_text || '',
    result: project?.result || '',
    result_text: project?.result_text || '',
    is_hidden: project?.is_hidden ?? false,
    sort_order: project?.sort_order ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin__field">
        <label>Project ID</label>
        <input
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          placeholder="e.g., paysika, jobsika"
          required
        />
      </div>
      <div className="admin__field">
        <label>Profile</label>
        <select
          value={form.profile_id}
          onChange={(e) => setForm({ ...form, profile_id: e.target.value })}
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="admin__field">
        <label>Tag</label>
        <input
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="admin__field">
        <label>Tagline</label>
        <input
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Impact</label>
        <input
          value={form.impact}
          onChange={(e) => setForm({ ...form, impact: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Site URL</label>
        <input
          value={form.site}
          onChange={(e) => setForm({ ...form, site: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Role</label>
        <input
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Period</label>
        <input
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Location</label>
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Challenge</label>
        <input
          value={form.challenge}
          onChange={(e) => setForm({ ...form, challenge: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Challenge Text</label>
        <textarea
          value={form.challenge_text}
          onChange={(e) => setForm({ ...form, challenge_text: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Solution</label>
        <input
          value={form.solution}
          onChange={(e) => setForm({ ...form, solution: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Solution Text</label>
        <textarea
          value={form.solution_text}
          onChange={(e) => setForm({ ...form, solution_text: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Result</label>
        <input
          value={form.result}
          onChange={(e) => setForm({ ...form, result: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Result Text</label>
        <textarea
          value={form.result_text}
          onChange={(e) => setForm({ ...form, result_text: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>
          <input
            type="checkbox"
            checked={form.is_hidden}
            onChange={(e) => setForm({ ...form, is_hidden: e.target.checked })}
          />
          Hidden
        </label>
      </div>
      <div className="admin__field">
        <label>Sort Order</label>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
        />
      </div>
      <div className="admin__actions">
        <button type="submit" disabled={saving} className="btn btn--primary">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn--secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

function BlogForm({ post, profiles, onSave, onCancel, saving }: {
  post: BlogPost | null;
  profiles: Profile[];
  onSave: (p: Partial<BlogPost>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    id: post?.id || '',
    profile_id: post?.profile_id || 'default',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    date: post?.date || '',
    author: post?.author || 'Ndouken Theryx',
    read_time: post?.read_time || '',
    image: post?.image || '',
    is_hidden: post?.is_hidden ?? false,
    sort_order: post?.sort_order ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin__field">
        <label>Post ID</label>
        <input
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          placeholder="e.g., my-blog-post"
          required
        />
      </div>
      <div className="admin__field">
        <label>Profile</label>
        <select
          value={form.profile_id}
          onChange={(e) => setForm({ ...form, profile_id: e.target.value })}
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="admin__field">
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="admin__field">
        <label>Excerpt</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Content (HTML)</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={10}
        />
      </div>
      <div className="admin__field">
        <label>Date</label>
        <input
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          placeholder="e.g., April 19, 2026"
        />
      </div>
      <div className="admin__field">
        <label>Author</label>
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>Read Time</label>
        <input
          value={form.read_time}
          onChange={(e) => setForm({ ...form, read_time: e.target.value })}
          placeholder="e.g., 5 min read"
        />
      </div>
      <div className="admin__field">
        <label>Image</label>
        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
      </div>
      <div className="admin__field">
        <label>
          <input
            type="checkbox"
            checked={form.is_hidden}
            onChange={(e) => setForm({ ...form, is_hidden: e.target.checked })}
          />
          Hidden
        </label>
      </div>
      <div className="admin__field">
        <label>Sort Order</label>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
        />
      </div>
      <div className="admin__actions">
        <button type="submit" disabled={saving} className="btn btn--primary">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn--secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}