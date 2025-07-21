import { Router } from 'express';
import { storage } from './storage';
import { hashPassword, comparePassword, generateToken, authenticateToken, AuthenticatedRequest } from './auth';
import { z } from 'zod';

const router = Router();

// Register schema
const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  password: z.string().min(6),
  address: z.string().optional(),
  city: z.string().optional(),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// User registration
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte existe déjà avec cet email' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create user
    const user = await storage.createUser({
      ...validatedData,
      password: hashedPassword,
      role: 'customer',
    });
    
    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    res.status(201).json({
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Données invalides', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Erreur lors de la création du compte' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
    
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Données invalides', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Get current user
router.get('/user', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await storage.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      isVerified: user.isVerified,
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const updateData = z.object({
      firstName: z.string().min(2).optional(),
      lastName: z.string().min(2).optional(),
      phone: z.string().min(9).optional(),
      address: z.string().optional(),
      city: z.string().optional(),
    }).parse(req.body);
    
    await storage.updateUser(req.user!.id, updateData);
    
    res.json({ message: 'Profil mis à jour avec succès' });
    
  } catch (error) {
    console.error('Update profile error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Données invalides', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(6),
    }).parse(req.body);
    
    // Get current user
    const user = await storage.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    
    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    await storage.updateUser(req.user!.id, { password: hashedPassword });
    
    res.json({ message: 'Mot de passe modifié avec succès' });
    
  } catch (error) {
    console.error('Change password error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Données invalides', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
  }
});

export { router as authRoutes };