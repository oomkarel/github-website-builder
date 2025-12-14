-- Update home page content with all sections including products and client logos
UPDATE page_content 
SET content_en = jsonb_build_object(
  'hero', jsonb_build_object(
    'images', jsonb_build_array(
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920',
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1920',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920'
    ),
    'title', 'Premium Packaging Solutions for Your Business',
    'subtitle', 'From small businesses to large corporations, we deliver quality packaging that elevates your brand',
    'badge', 'Your Trusted Packaging Partner',
    'cta_primary', 'Corporate Solutions',
    'cta_secondary', 'SME Solutions'
  ),
  'features', jsonb_build_object(
    'title', 'Why Choose Us?',
    'subtitle', 'We are committed to providing the best packaging solutions for your business.',
    'items', jsonb_build_array(
      jsonb_build_object('icon', 'Package', 'title', 'Large Production Capacity', 'description', 'Capable of meeting large-scale packaging needs for various industries.'),
      jsonb_build_object('icon', 'Shield', 'title', 'Food-Grade & Safe', 'description', 'High-quality materials that are safe for food and beverages.'),
      jsonb_build_object('icon', 'Users', 'title', 'Long-term Partnership', 'description', 'We focus on building sustainable business relationships.'),
      jsonb_build_object('icon', 'Zap', 'title', 'Custom Branding', 'description', 'Custom packaging design according to your brand identity.')
    )
  ),
  'stats', jsonb_build_object(
    'items', jsonb_build_array(
      jsonb_build_object('value', 500, 'suffix', '+', 'label', 'Clients Served'),
      jsonb_build_object('value', 10, 'suffix', 'M+', 'label', 'Products Produced'),
      jsonb_build_object('value', 15, 'suffix', '+', 'label', 'Years Experience'),
      jsonb_build_object('value', 50, 'suffix', '+', 'label', 'Employees')
    )
  ),
  'products', jsonb_build_object(
    'title', 'Our Products',
    'subtitle', 'Discover our wide range of quality packaging solutions.',
    'items', jsonb_build_array(
      jsonb_build_object('image', 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600', 'name', 'Paper Bag', 'description', 'Eco-friendly paper bags for various needs'),
      jsonb_build_object('image', 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=600', 'name', 'Food Container', 'description', 'Safe food-grade containers'),
      jsonb_build_object('image', 'https://images.unsplash.com/photo-1617952385804-7b326fa42678?w=600', 'name', 'Coffee Cup', 'description', 'Hot and cold beverage cups'),
      jsonb_build_object('image', 'https://images.unsplash.com/photo-1571211905393-6de67ff8fb61?w=600', 'name', 'Custom Packaging', 'description', 'Tailored packaging solutions')
    )
  ),
  'clients', jsonb_build_object(
    'title', 'Trusted by Leading Brands',
    'subtitle', 'We are proud to serve these amazing companies.',
    'logos', jsonb_build_array(
      jsonb_build_object('name', 'Company 1', 'image', ''),
      jsonb_build_object('name', 'Company 2', 'image', ''),
      jsonb_build_object('name', 'Company 3', 'image', ''),
      jsonb_build_object('name', 'Company 4', 'image', ''),
      jsonb_build_object('name', 'Company 5', 'image', ''),
      jsonb_build_object('name', 'Company 6', 'image', '')
    )
  ),
  'testimonials', jsonb_build_object(
    'title', 'What Our Clients Say?',
    'subtitle', 'Client satisfaction is our top priority.',
    'items', jsonb_build_array(
      jsonb_build_object('quote', 'Bungkus Indonesia has been our packaging partner for 5 years. The quality of their products and services is very consistent.', 'name', 'Budi Santoso', 'role', 'Procurement Manager', 'company', 'PT Makanan Nusantara', 'avatar', ''),
      jsonb_build_object('quote', 'As an SME, we are greatly helped by the flexible MOQ and competitive prices from Bungkus Indonesia.', 'name', 'Siti Rahayu', 'role', 'Owner', 'company', 'Dapur Mama Siti', 'avatar', ''),
      jsonb_build_object('quote', 'The custom branding process is very easy and the results are satisfying. Their team is very responsive and professional.', 'name', 'Ahmad Wijaya', 'role', 'Marketing Director', 'company', 'CV Berkah Snacks', 'avatar', '')
    )
  ),
  'cta', jsonb_build_object(
    'title', 'Ready to Start a Partnership with Us?',
    'subtitle', 'Contact us now for free consultation and the best offers.',
    'primary_button', 'Contact Us',
    'secondary_button', 'View Products'
  ),
  'meta_title', 'Bungkus Indonesia - Premium Packaging Solutions',
  'meta_description', 'Leading packaging manufacturer in Indonesia. Custom solutions for corporate and UMKM businesses.'
),
content_id = jsonb_build_object(
  'hero', jsonb_build_object(
    'images', jsonb_build_array(
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920',
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1920',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920'
    ),
    'title', 'Solusi Kemasan Premium untuk Bisnis Anda',
    'subtitle', 'Dari usaha kecil hingga perusahaan besar, kami menghadirkan kemasan berkualitas yang mengangkat brand Anda',
    'badge', 'Mitra Kemasan Terpercaya',
    'cta_primary', 'Solusi Korporat',
    'cta_secondary', 'Solusi UMKM'
  ),
  'features', jsonb_build_object(
    'title', 'Mengapa Memilih Kami?',
    'subtitle', 'Kami berkomitmen memberikan solusi kemasan terbaik untuk bisnis Anda.',
    'items', jsonb_build_array(
      jsonb_build_object('icon', 'Package', 'title', 'Kapasitas Produksi Besar', 'description', 'Mampu memenuhi kebutuhan kemasan dalam skala besar untuk berbagai industri.'),
      jsonb_build_object('icon', 'Shield', 'title', 'Food-Grade & Aman', 'description', 'Material berkualitas tinggi yang aman untuk makanan dan minuman.'),
      jsonb_build_object('icon', 'Users', 'title', 'Kemitraan Jangka Panjang', 'description', 'Kami fokus membangun hubungan bisnis yang berkelanjutan.'),
      jsonb_build_object('icon', 'Zap', 'title', 'Custom Branding', 'description', 'Desain kemasan custom sesuai identitas brand Anda.')
    )
  ),
  'stats', jsonb_build_object(
    'items', jsonb_build_array(
      jsonb_build_object('value', 500, 'suffix', '+', 'label', 'Klien Terlayani'),
      jsonb_build_object('value', 10, 'suffix', 'M+', 'label', 'Produk Diproduksi'),
      jsonb_build_object('value', 15, 'suffix', '+', 'label', 'Tahun Pengalaman'),
      jsonb_build_object('value', 50, 'suffix', '+', 'label', 'Karyawan')
    )
  ),
  'products', jsonb_build_object(
    'title', 'Produk Kami',
    'subtitle', 'Temukan berbagai solusi kemasan berkualitas kami.',
    'items', jsonb_build_array(
      jsonb_build_object('image', 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600', 'name', 'Paper Bag', 'description', 'Tas kertas ramah lingkungan untuk berbagai kebutuhan'),
      jsonb_build_object('image', 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=600', 'name', 'Food Container', 'description', 'Wadah makanan food-grade yang aman'),
      jsonb_build_object('image', 'https://images.unsplash.com/photo-1617952385804-7b326fa42678?w=600', 'name', 'Coffee Cup', 'description', 'Gelas untuk minuman panas dan dingin'),
      jsonb_build_object('image', 'https://images.unsplash.com/photo-1571211905393-6de67ff8fb61?w=600', 'name', 'Custom Packaging', 'description', 'Solusi kemasan yang disesuaikan')
    )
  ),
  'clients', jsonb_build_object(
    'title', 'Dipercaya oleh Brand Terkemuka',
    'subtitle', 'Kami bangga melayani perusahaan-perusahaan luar biasa ini.',
    'logos', jsonb_build_array(
      jsonb_build_object('name', 'Perusahaan 1', 'image', ''),
      jsonb_build_object('name', 'Perusahaan 2', 'image', ''),
      jsonb_build_object('name', 'Perusahaan 3', 'image', ''),
      jsonb_build_object('name', 'Perusahaan 4', 'image', ''),
      jsonb_build_object('name', 'Perusahaan 5', 'image', ''),
      jsonb_build_object('name', 'Perusahaan 6', 'image', '')
    )
  ),
  'testimonials', jsonb_build_object(
    'title', 'Apa Kata Klien Kami?',
    'subtitle', 'Kepuasan klien adalah prioritas utama kami.',
    'items', jsonb_build_array(
      jsonb_build_object('quote', 'Bungkus Indonesia telah menjadi mitra kemasan kami selama 5 tahun. Kualitas produk dan layanan mereka sangat konsisten.', 'name', 'Budi Santoso', 'role', 'Procurement Manager', 'company', 'PT Makanan Nusantara', 'avatar', ''),
      jsonb_build_object('quote', 'Sebagai UMKM, kami sangat terbantu dengan MOQ yang fleksibel dan harga yang kompetitif dari Bungkus Indonesia.', 'name', 'Siti Rahayu', 'role', 'Owner', 'company', 'Dapur Mama Siti', 'avatar', ''),
      jsonb_build_object('quote', 'Proses custom branding sangat mudah dan hasilnya memuaskan. Tim mereka sangat responsif dan profesional.', 'name', 'Ahmad Wijaya', 'role', 'Marketing Director', 'company', 'CV Berkah Snacks', 'avatar', '')
    )
  ),
  'cta', jsonb_build_object(
    'title', 'Siap Memulai Kemitraan dengan Kami?',
    'subtitle', 'Hubungi kami sekarang untuk konsultasi gratis dan penawaran terbaik.',
    'primary_button', 'Hubungi Kami',
    'secondary_button', 'Lihat Produk'
  ),
  'meta_title', 'Bungkus Indonesia - Solusi Kemasan Premium',
  'meta_description', 'Produsen kemasan terkemuka di Indonesia. Solusi custom untuk korporat dan UMKM.'
)
WHERE page_key = 'home';

-- Insert site-wide settings for header, footer, popups
INSERT INTO site_settings (key, value) VALUES 
('header', jsonb_build_object(
  'logo_light', '',
  'logo_dark', '',
  'nav_items', jsonb_build_array(
    jsonb_build_object('href', '/', 'label_en', 'Home', 'label_id', 'Beranda'),
    jsonb_build_object('label_en', 'Solutions', 'label_id', 'Solusi', 'children', jsonb_build_array(
      jsonb_build_object('href', '/solusi-korporat', 'label_en', 'Corporate', 'label_id', 'Korporat'),
      jsonb_build_object('href', '/solusi-umkm', 'label_en', 'UMKM', 'label_id', 'UMKM')
    )),
    jsonb_build_object('href', '/produk', 'label_en', 'Products', 'label_id', 'Produk'),
    jsonb_build_object('href', '/case-studies', 'label_en', 'Case Studies', 'label_id', 'Case Studies'),
    jsonb_build_object('href', '/blog', 'label_en', 'Blog', 'label_id', 'Blog'),
    jsonb_build_object('href', '/tentang-kami', 'label_en', 'About Us', 'label_id', 'Tentang Kami')
  ),
  'cta_button', jsonb_build_object('href', '/hubungi-kami', 'label_en', 'Contact Us', 'label_id', 'Hubungi Kami')
))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value) VALUES 
('footer', jsonb_build_object(
  'description_en', 'Quality packaging solutions for Indonesian businesses. Serving corporations and SMEs with dedication.',
  'description_id', 'Solusi kemasan berkualitas untuk bisnis Indonesia. Melayani korporasi dan UMKM dengan dedikasi.',
  'contact', jsonb_build_object(
    'email', 'info@bungkusindonesia.com',
    'phone', '+62 21 1234 5678',
    'address', 'Jakarta, Indonesia'
  ),
  'social', jsonb_build_object(
    'instagram', 'https://instagram.com',
    'linkedin', 'https://linkedin.com',
    'facebook', 'https://facebook.com',
    'whatsapp', '6281234567890'
  ),
  'quick_links', jsonb_build_array(
    jsonb_build_object('href', '/', 'label_en', 'Home', 'label_id', 'Beranda'),
    jsonb_build_object('href', '/solusi-korporat', 'label_en', 'Corporate Solutions', 'label_id', 'Solusi Korporat'),
    jsonb_build_object('href', '/solusi-umkm', 'label_en', 'SME Solutions', 'label_id', 'Solusi UMKM'),
    jsonb_build_object('href', '/produk', 'label_en', 'Products', 'label_id', 'Produk'),
    jsonb_build_object('href', '/blog', 'label_en', 'Blog', 'label_id', 'Blog'),
    jsonb_build_object('href', '/tentang-kami', 'label_en', 'About Us', 'label_id', 'Tentang Kami')
  ),
  'copyright_en', 'All rights reserved.',
  'copyright_id', 'Hak cipta dilindungi.'
))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value) VALUES 
('popup', jsonb_build_object(
  'enabled', false,
  'title_en', 'Special Offer!',
  'title_id', 'Penawaran Spesial!',
  'content_en', 'Get 10% off your first order. Contact us today!',
  'content_id', 'Dapatkan diskon 10% untuk pesanan pertama Anda. Hubungi kami hari ini!',
  'button_text_en', 'Contact Now',
  'button_text_id', 'Hubungi Sekarang',
  'button_link', '/hubungi-kami',
  'image', ''
))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value) VALUES 
('design', jsonb_build_object(
  'primary_color', '220 60% 25%',
  'secondary_color', '40 95% 55%',
  'font_heading', 'Plus Jakarta Sans',
  'font_body', 'Inter'
))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;