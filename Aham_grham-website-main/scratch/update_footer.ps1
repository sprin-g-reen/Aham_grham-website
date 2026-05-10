$path = "d:\newyogaproject\newyogaproject\style.css"
$content = Get-Content $path -Raw

# Replace mobile footer-container
$content = $content -replace "\.footer-container \{\s+padding-bottom: 48px;\s+gap: 56px;\s+\}", ".footer-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  padding-bottom: 48px;
  width: 100%;
}"

# Replace headings and typography
$content = $content -replace "\.footer-col h4,\s+\.footer-subheading \{[\s\S]+?\}\s+\.footer-subheading \{\s+margin-top: 44px !important;\s+\}\s+\.footer-col ul li,\s+\.contact-link \{[\s\S]+?\}", ".footer-col h4,
.footer-subheading {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: var(--accent-purple) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.15em !important;
  border-bottom: 1px solid rgba(127, 119, 221, 0.15);
  padding-bottom: 12px;
  margin-bottom: 20px !important;
  display: block;
}

.footer-subheading {
  margin-top: 44px !important;
}

.footer-col ul li,
.contact-link {
  font-size: 15px !important;
  color: #cbd5e1 !important;
  margin-bottom: 0px;
  list-style: none;
  font-weight: 400;
  text-decoration: none;
  line-height: 1.8 !important;
}

.footer-social-links {
  display: flex;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin-top: 12px;
  flex-wrap: wrap;
}

.footer-social-links li a {
  font-size: 14px;
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-social-links li a:hover {
  color: var(--accent-purple) !important;
}"

# Replace the desktop grid block with the full responsive logic
$content = $content -replace "@media \(max-width: 1024px\) \{[\s\S]+?\.footer-container \{\s+gap: 28px;\s+padding-bottom: 28px;\s+\}\s+\}", "@media (max-width: 1024px) {
  .footer {
    border-radius: 0;
  }
  .footer-main,
  .footer-bottom {
    padding-left: 24px;
    padding-right: 24px;
  }
  .footer-top {
    padding-left: 0;
    padding-right: 0;
  }
}"

# Replace the old desktop container definition
$content = $content -replace "\.footer-container \{\s+grid-template-columns: 1\.5fr 0\.8fr 0\.8fr 0\.8fr 0\.8fr;\s+align-items: start;\s+\}", "@media (min-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 60px 40px;
  }
  
  .footer-brand-col {
    grid-column: span 2;
    align-items: center !important;
    text-align: center !important;
    border-bottom: 1px solid rgba(127, 119, 221, 0.1);
    padding-bottom: 48px;
    margin-bottom: 20px;
  }
  
  .footer-quote {
    text-align: center !important;
  }
}

@media (min-width: 1024px) {
  .footer-container {
    grid-template-columns: 1.5fr 0.8fr 0.8fr 0.8fr 0.8fr;
    gap: 32px;
  }
  
  .footer-brand-col {
    grid-column: span 1;
    align-items: flex-start !important;
    text-align: left !important;
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
    padding-right: 48px;
    border-right: 1px solid rgba(127, 119, 221, 0.1);
  }
  
  .footer-quote {
    text-align: left !important;
  }
}"

Set-Content $path $content
