-- Add missing content sections for huddle page
INSERT INTO page_content (page_name, section_name, content_type, content_value, display_order, is_active) VALUES
-- Magic Steps 3-5
('huddle', 'magic_step_3_title', 'text', 'Get Your Pengu Shares', 13, true),
('huddle', 'magic_step_3_desc', 'textarea', 'Your deposit is converted into Pengu Stocks. You''ll see your holdings and total value in your portfolio dashboard.', 14, true),
('huddle', 'magic_step_4_title', 'text', 'Watch the Magic Happen', 15, true),
('huddle', 'magic_step_4_desc', 'textarea', 'As Pengu grows, your stock value increases. Verified holders also unlock airdrops and exclusive benefits.', 16, true),
('huddle', 'magic_step_5_title', 'text', 'Withdraw Anytime', 17, true),
('huddle', 'magic_step_5_desc', 'textarea', 'If you wish to exit, simply sell your Pengu Stocks and withdraw your balance.', 18, true),

-- Success Stories
('huddle', 'success_stories_title', 'text', 'Success Stories', 19, true),
('huddle', 'success_stories_subtitle', 'text', '(For Illustration Only)', 20, true),
('huddle', 'success_story_1_title', 'text', '🚀 Starter Pack', 21, true),
('huddle', 'success_story_1_desc', 'textarea', '<strong>$5,000 journey</strong><br/>With 20% growth in 30 days, portfolio = <span class="text-green-400 font-bold">$6,000 (+$1,000 profit)</span>', 22, true),
('huddle', 'success_story_2_title', 'text', '💎 Whale Package', 23, true),
('huddle', 'success_story_2_desc', 'textarea', '<strong>$50,000 adventure</strong><br/>With 20% growth in 30 days, portfolio = <span class="text-green-400 font-bold">$60,000 (+$10,000 profit)</span>', 24, true),
('huddle', 'success_story_3_title', 'text', '📊 Market Performance', 25, true),
('huddle', 'success_story_3_desc', 'textarea', '<strong>📊 Your success depends on market performance.</strong> The higher your journey, the greater your potential returns.', 26, true),

-- Modal Content
('huddle', 'modal_title', 'text', 'Ready to Invest?', 27, true),
('huddle', 'modal_desc', 'textarea', 'You''re about to start your Pudgy Penguins adventure with a ${amount} investment.', 28, true),
('huddle', 'modal_what_happens_title', 'text', 'What happens next?', 29, true),
('huddle', 'modal_step_1', 'text', 'Choose your preferred cryptocurrency', 30, true),
('huddle', 'modal_step_2', 'text', 'Complete the deposit process', 31, true),
('huddle', 'modal_step_3', 'text', 'Start earning with Pudgy Penguins', 32, true)

ON CONFLICT (page_name, section_name) DO NOTHING;


