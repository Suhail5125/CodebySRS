# 🚀 Deployment Guide

## Pre-Deployment Checklist

### 1. **Update Content**
- [ ] Login to admin panel (`/admin/login`)
- [ ] Update About info with real company details
- [ ] Add real projects with images
- [ ] Add real skills and technologies
- [ ] Update social media links
- [ ] Update contact information (email, phone, location)
- [ ] Test contact form

### 2. **Security**
- [ ] Change admin password (currently: `admin123`)
- [ ] Update session secret in environment variables
- [ ] Review and update CORS settings
- [ ] Enable HTTPS in production

### 3. **Configuration**
- [ ] Set up environment variables
- [ ] Configure database path
- [ ] Update API base URL
- [ ] Set production domain

### 4. **Testing**
- [ ] Test all pages on desktop
- [ ] Test all pages on mobile
- [ ] Test admin panel functionality
- [ ] Test contact form submission
- [ ] Test dark mode
- [ ] Test all navigation links
- [ ] Test 404 page
- [ ] Test error boundaries

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=production
SESSION_SECRET=your-super-secret-session-key-change-this

# Database
DATABASE_PATH=./portfolio.db

# Email (Optional - for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin
ADMIN_EMAIL=admin@yourcompany.com
```

---

## Deployment Options

### **Option 1: Vercel (Recommended for Frontend)**

#### **Frontend Only**
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

#### **Full Stack (Frontend + Backend)**
1. Use Vercel for frontend
2. Use Railway/Render for backend
3. Update API URLs in frontend

### **Option 2: Railway (Full Stack)**

1. **Create Railway Account**
   - Go to railway.app
   - Sign up with GitHub

2. **Deploy**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   railway init
   
   # Deploy
   railway up
   ```

3. **Configure**
   - Add environment variables in Railway dashboard
   - Set up custom domain
   - Enable automatic deployments

### **Option 3: Render**

1. **Create Render Account**
   - Go to render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Connect GitHub repository
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Add environment variables

3. **Deploy**
   - Render will auto-deploy on push

### **Option 4: VPS (DigitalOcean, AWS, etc.)**

1. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd CodebySRS
   
   # Install dependencies
   npm install
   
   # Build
   npm run build
   
   # Setup database
   npm run db:migrate
   npm run db:seed
   
   # Start with PM2
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

3. **Setup Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Setup SSL with Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Database Setup

### **Development**
```bash
# Create tables
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### **Production**
```bash
# Create tables only (no seed data)
npm run db:migrate

# Add your content via admin panel
```

---

## Build Commands

```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Start production server
npm start

# Development mode
npm run dev
```

---

## Post-Deployment

### 1. **DNS Configuration**
- Point your domain to deployment server
- Add A record or CNAME
- Wait for DNS propagation (up to 48 hours)

### 2. **SSL Certificate**
- Most platforms (Vercel, Railway, Render) provide automatic SSL
- For VPS, use Let's Encrypt/Certbot

### 3. **Monitoring**
- Set up error tracking (Sentry)
- Monitor uptime (UptimeRobot)
- Check analytics (Google Analytics)

### 4. **Backup**
- Regular database backups
- Code backups via Git
- Environment variables backup

---

## Troubleshooting

### **Build Fails**
- Check Node.js version (18+ required)
- Clear node_modules and reinstall
- Check for TypeScript errors

### **Database Issues**
- Ensure database file has write permissions
- Check database path in environment variables
- Run migrations again

### **API Not Working**
- Check CORS settings
- Verify API base URL
- Check environment variables
- Review server logs

### **Admin Login Issues**
- Verify database was seeded
- Check session secret is set
- Clear browser cookies
- Try password reset

---

## Performance Optimization

### **Frontend**
- Enable gzip compression
- Optimize images (WebP format)
- Lazy load images
- Code splitting
- CDN for static assets

### **Backend**
- Enable caching
- Database indexing
- Connection pooling
- Rate limiting

### **Database**
- Regular VACUUM
- Index frequently queried columns
- Optimize queries

---

## Security Best Practices

1. **Change Default Credentials**
   - Update admin password immediately
   - Use strong, unique passwords

2. **Environment Variables**
   - Never commit .env files
   - Use platform-specific secret management

3. **HTTPS**
   - Always use HTTPS in production
   - Redirect HTTP to HTTPS

4. **Rate Limiting**
   - Implement on contact form
   - Implement on login endpoint

5. **Input Validation**
   - Already implemented with Zod
   - Keep validation rules updated

6. **Regular Updates**
   - Update dependencies regularly
   - Monitor security advisories

---

## Maintenance

### **Regular Tasks**
- Weekly: Check error logs
- Monthly: Update dependencies
- Monthly: Database backup
- Quarterly: Security audit
- Yearly: SSL certificate renewal (if manual)

### **Monitoring**
- Set up error alerts
- Monitor server resources
- Track user analytics
- Review contact form submissions

---

## Support

### **Common Issues**
1. **Forgot Admin Password**
   - Access database directly
   - Update password hash
   - Or re-seed database

2. **Database Locked**
   - Check for concurrent writes
   - Restart server
   - Check file permissions

3. **Images Not Loading**
   - Check image URLs
   - Verify CORS settings
   - Check network tab in browser

---

## Rollback Plan

If deployment fails:

1. **Revert to Previous Version**
   ```bash
   git revert HEAD
   git push
   ```

2. **Restore Database**
   ```bash
   # Restore from backup
   cp portfolio.db.backup portfolio.db
   ```

3. **Clear Cache**
   ```bash
   # Clear build cache
   rm -rf dist node_modules
   npm install
   npm run build
   ```

---

## Success Checklist

After deployment, verify:
- [ ] Homepage loads correctly
- [ ] All sections display properly
- [ ] Navigation works
- [ ] Contact form submits
- [ ] Admin panel accessible
- [ ] Can login to admin
- [ ] Can add/edit content
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Custom domain working
- [ ] No console errors
- [ ] SEO meta tags present

---

**Ready to Deploy?** 🚀

Choose your deployment platform and follow the steps above. Good luck!

**Need Help?** Check the troubleshooting section or review server logs for detailed error messages.
