using CineRepository.Data.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Implementations
{
    public class UnitOfWork : IUnitOfWork, IAsyncDisposable
    {
        private readonly CineDbContext _context;
        private IDbContextTransaction? _transaction;
        public UnitOfWork(CineDbContext context)
        {
            _context = context;
        }
        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            if (_transaction == null)
                throw new InvalidOperationException(
                    "No hay una transacción activa.");

            await _transaction.CommitAsync();

            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public async Task RollbackAsync()
        {
            if (_transaction == null)
                return;

            await _transaction.RollbackAsync();

            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async ValueTask DisposeAsync()
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }
}
