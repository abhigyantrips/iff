-- Seed data: Welcome campaign (migrated from markdown content)

INSERT INTO campaign (id, slug, title, description, content, date, emailTo, emailCc, emailBcc, createdAt, updatedAt)
VALUES (
    'welcome-campaign-001',
    'welcome-to-our-newsletter',
    'Welcome to Our Newsletter',
    'An introductory email campaign to welcome new subscribers to our community.',
    '<h1>Welcome to Our Community!</h1>

<p>We''re thrilled to have you join us. This is the beginning of an exciting journey together.</p>

<h2>What to Expect</h2>

<ul>
<li><strong>Weekly Updates</strong>: Stay informed with our latest news and developments</li>
<li><strong>Exclusive Content</strong>: Access to members-only resources and guides</li>
<li><strong>Community Events</strong>: Invitations to webinars, meetups, and more</li>
</ul>

<h2>Getting Started</h2>

<ol>
<li>Complete your profile settings</li>
<li>Explore our resource library</li>
<li>Join our community forum</li>
</ol>

<p>We''re here to help you succeed. If you have any questions, don''t hesitate to reach out!</p>

<p>Best regards,<br><strong>The Team</strong></p>',
    1744502400, -- 2026-04-13 00:00:00 UTC
    '[{"name": "John Doe", "email": "john@example.com"}, {"name": "Jane Smith", "email": "jane@example.com"}]',
    '[{"name": "Marketing Team", "email": "marketing@example.com"}]',
    '[{"name": "Admin", "email": "admin@example.com"}]',
    1744532352, -- Current timestamp
    1744532352  -- Current timestamp
);
